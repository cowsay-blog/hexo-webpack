const Hexo = require('hexo')
const hexocli = require('hexo-cli')
const fs = require('fs-extra')
const path = require('path')
const nanoid = require('nanoid')
const hfm = require('hexo-front-matter')
const yaml = require('js-yaml')
const { EventEmitter } = require('events')

const ROOT_DIR = path.resolve(__dirname, '..', '..')
const TEST_DIR = path.join(ROOT_DIR, 'test')
const TMP_DIR = path.join(TEST_DIR, '.tmp')
const HEXO_TEMPLATE_DIR = path.join(TMP_DIR, '__hexo__')
const FIXTURE_DIR = path.join(TEST_DIR, 'fixtures')
const POST_TEMPLATE_FILE = path.join(FIXTURE_DIR, 'template.md')

/**
 * @type {Map<string, HexoInstance>}
 */
const instancePool = new Map()

class HexoInstance extends EventEmitter {
  constructor (id) {
    super()

    this.id = id
    this.cwd = path.join(TMP_DIR, this.id)
    this.fsReady = false
  }

  async initFiles () {
    await fs.emptyDir(this.cwd)
    await fs.copy(HEXO_TEMPLATE_DIR, this.cwd, {
      overwrite: true
    })
    await fs.emptyDir(path.join(this.cwd, 'source', '_posts'))
    this.fsReady = true
  }

  async init (config) {
    if (!this.fsReady) this.initFiles()

    // tweak config
    const configYmlFile = path.join(this.cwd, '_config.yml')
    const configYmlObj = yaml.load(
      await fs.readFile(configYmlFile, 'utf8')
    )

    Object.assign(
      configYmlObj,
      typeof config === 'function'
        ? config(configYmlObj)
        : config
    )

    await fs.writeFile(configYmlFile, yaml.dump(configYmlObj), 'utf8')

    this.hexo = new Hexo(this.cwd)
    this.theme = this.hexo.config.theme

    await this.hexo.init()
    await this.hexo.loadPlugin(require.resolve(ROOT_DIR))
  }

  async createPost (name, frontMatter = {}) {
    if (typeof name === 'object') {
      frontMatter = name
      name = undefined
    }

    if (!name) {
      name = nanoid()
    }

    const template = await fs.readFile(POST_TEMPLATE_FILE, 'utf8')
    const front = hfm.parse(template)
    Object.assign(front, frontMatter)

    const targetFile = path.join(this.postDir, `${name}.md`)
    await fs.writeFile(
      targetFile,
      hfm.stringify(front),
      'utf8'
    )

    return targetFile
  }

  configure (obj) {
    Object.assign(this.hexo.config, {
      nanoid: obj
    })
  }

  async load () {
    await this.hexo.load()
  }

  get route () {
    return this.hexo.route
  }

  static async init (
    materials = [ 'themes', '_config.yml' ]
  ) {
    await fs.emptyDir(TMP_DIR)
    await fs.ensureDir(HEXO_TEMPLATE_DIR)

    await hexocli(HEXO_TEMPLATE_DIR, {
      _: [ 'init' ],
      clone: false,
      install: true
    })

    await Promise.all(materials.map(
      material => fs.copy(
        path.join(FIXTURE_DIR, material),
        path.join(HEXO_TEMPLATE_DIR, material),
        {
          overwrite: true
        }
      )
    ))
  }

  static async destroy () {
    await fs.remove(TMP_DIR)
    instancePool.clear()
  }

  static create () {
    let id
    do {
      id = nanoid()
    } while (instancePool.has(id))
    return new HexoInstance(id)
  }

  get postDir () {
    return path.join(this.cwd, 'source', '_posts')
  }

  static get pool () {
    return instancePool
  }

  static hook (test, materials, config) {
    test.before('Init tmp', function () {
      return HexoInstance.init(materials)
    })

    test.after('Clear tmp', function () {
      return HexoInstance.destroy()
    })

    test.beforeEach('Init hexo instance', async function (t) {
      const instance = HexoInstance.create()
      await instance.init(config)
      t.context.instance = instance
    })
  }
}

HexoInstance.resources = {
  ROOT_DIR,
  TEST_DIR,
  TMP_DIR,
  HEXO_TEMPLATE_DIR,
  FIXTURE_DIR,
  POST_TEMPLATE_FILE
}

module.exports = HexoInstance

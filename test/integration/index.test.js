const test = require('ava')
const path = require('path')
const fs = require('fs-extra')
const streamtoString = require('stream-to-string')

const HexoInstance = require('../utils/HexoInstance')

function tweakContext (configStr = '', context = '') {
  return configStr.replace(
    /module\.exports\s*?=\s*{\n/,
    `module.exports = {\n  context: '${context.replace(/\\/g, '\\\\')}',\n`
  )
}

test.before('Init tmp', function () {
  return HexoInstance.init([
    'themes',
    '_config.yml',
    'webpack.config.js',
    'source'
  ])
})

test.after('Clear tmp', function () {
  return HexoInstance.destroy()
})

test.beforeEach('Init hexo instance', async function (t) {
  const instance = HexoInstance.create()
  await instance.initFiles()

  // tweak webpack config
  const themeWebpackConfigFile = path.join(instance.cwd, 'themes', 'test', 'webpack.config.js')
  const instanceWebpackConfigFile = path.join(instance.cwd, 'webpack.config.js')
  const themeWebpackConfig = await fs.readFile(themeWebpackConfigFile, 'utf8')
  const instanceWebpackConfig = await fs.readFile(instanceWebpackConfigFile, 'utf8')
  const context = path.resolve(instance.cwd)
  await fs.writeFile(themeWebpackConfigFile, tweakContext(themeWebpackConfig, context), 'utf8')
  await fs.writeFile(instanceWebpackConfigFile, tweakContext(instanceWebpackConfig, context), 'utf8')

  await instance.init({
    theme: 'test'
  })
  t.context.instance = instance
})

test('contextual conventional webpack config', async (t) => {
  t.plan(2)

  /** @type {HexoInstance} */
  const instance = t.context.instance

  await instance.load()

  const expectedThemeBundleFile = path.join(HexoInstance.resources.FIXTURE_DIR, 'theme-bundle.js')
  const expectedInstanceBundleFile = path.join(HexoInstance.resources.FIXTURE_DIR, 'instance-bundle.js')

  await Promise.all([
    Promise.all([
      await streamtoString(instance.route.get('theme-bundle.js')),
      await streamtoString(fs.createReadStream(expectedThemeBundleFile, 'utf8'))
    ])
      .then(([ themeBunble, expectedThemeBunble ]) => {
        t.is(themeBunble, expectedThemeBunble)
      }),
    Promise.all([
      await streamtoString(instance.route.get('instance-bundle.js')),
      await streamtoString(fs.createReadStream(expectedInstanceBundleFile, 'utf8'))
    ])
      .then(([ instanceBundle, expectedInstanceBundle ]) => {
        t.is(instanceBundle, expectedInstanceBundle)
      })
  ])
})

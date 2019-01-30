const path = require('path')

/**
 * @param {string} pkg
 * @param {any} [defaultValue]
 */
function requireIgnoreMissing (pkg, defaultValue) {
  try {
    return require(pkg)
  } catch (e) {
    return defaultValue
  }
}

/**
 * @param {any} obj
 * @return {Array<any}
 */
function castArray (obj) {
  return Array.isArray(obj) ? obj : [ obj ]
}

function resolveWebpackEntry (baseDir, config) {
  config.entry = typeof config.entry === 'string' ? path.resolve(baseDir, config.entry)
    : Array.isArray(config.entry) ? config.entry.map(eachEntry => path.resolve(baseDir, eachEntry))
      : Object.keys(config.entry)
        .map(key => ({ key, value: path.resolve(baseDir, config.entry[key]) }))
        .reduce((_entry, obj) => {
          _entry[obj.key] = obj.value
          return _entry
        }, {})
  return config
}

function toPosixLikeAbs (filepath) {
  const { root } = path.parse(filepath)
  return filepath.replace(root, '/').replace(path.sep, '/')
}

function resolveWebpackOutput (config) {
  let outputPath = !config.output || !config.output.path ? '/'
    : toPosixLikeAbs(config.output.path)

  return Object.assign(config, {
    output: {
      ...config.output,
      path: outputPath
    }
  })
}

module.exports = {
  requireIgnoreMissing,
  castArray,
  resolveWebpackEntry,
  resolveWebpackOutput
}

const path = require('path')

module.exports = function resolveEntry (baseDir, config) {
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

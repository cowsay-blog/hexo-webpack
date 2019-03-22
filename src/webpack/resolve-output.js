const { toPosixLikeAbs } = require('../utils')

module.exports = function resolveOutput (config) {
  let outputPath = !config.output || !config.output.path ? '/'
    : toPosixLikeAbs(config.output.path)

  return Object.assign(config, {
    output: {
      ...config.output,
      path: outputPath
    }
  })
}

const webpack = require('webpack')
const MemoryFS = require('memory-fs')
const Promise = require('bluebird')

module.exports = function compile (hexo, config) {
  const compiler = webpack(config)
  const mfs = new MemoryFS()
  compiler.outputFileSystem = mfs

  return Promise.fromCallback(
    compiler.run.bind(compiler)
  )
    .catch(err => {
      hexo.log.error(err.stack || err)
      if (err.details) {
        hexo.log.error(err.details)
      }
    })
    .then(stats => {
      const info = stats.toJson()

      if (stats.hasErrors()) {
        hexo.log.error(info.errors)
      }

      if (stats.hasWarnings()) {
        hexo.log.warn(info.warnings)
      }

      return mfs
    })
}

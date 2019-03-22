const webpack = require('webpack')
const MemoryFS = require('memory-fs')
const Promise = require('bluebird')

const ForEachModulePlugin = require('./ForEachModulePlugin')
const resolveEntry = require('./resolve-entry')
const resolveOutput = require('./resolve-output')
const installPlugins = require('./install-plugins')

const logger = require('../logger')

function compile (config) {
  const compiler = webpack(config)
  const mfs = new MemoryFS()
  compiler.outputFileSystem = mfs

  return Promise.fromCallback(
    compiler.run.bind(compiler)
  )
    .catch(err => {
      logger.error(err.stack || err)
      if (err.details) {
        logger.error(err.details)
      }
    })
    .then(stats => {
      const info = stats.toJson()

      if (stats.hasErrors()) {
        info.errors.forEach(e => logger.error(e))
      }

      if (stats.hasWarnings()) {
        info.warnings.forEach(w => logger.warn(w))
      }

      return mfs
    })
}

module.exports = {
  compile,
  ForEachModulePlugin,
  resolveEntry,
  resolveOutput,
  installPlugins
}

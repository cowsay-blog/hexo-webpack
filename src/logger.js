const PKG_NAME = 'hexo-webpack'

let _logger = console

function log (level, msg, ...args) {
  return _logger[level](`[${PKG_NAME}] ${msg}`, ...args)
}

module.exports = {
  init (hexo = {}) {
    _logger = hexo.log || _logger
    return this
  },
  debug (msg, ...args) {
    return log('debug', msg, ...args)
  },
  info (msg, ...args) {
    return log('info', msg, ...args)
  },
  warn (msg, ...args) {
    return log('warn', msg, ...args)
  },
  error (msg, ...args) {
    return log('error', msg, ...args)
  }
}

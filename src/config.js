const path = require('path')
const _ = require('./lodash')

const {
  requireIgnoreMissing,
  castArray
} = require('./utils')

const {
  base_dir: BASE_DIR,
  theme_dir: THEME_DIR
} = hexo

const webpackConfigFilename = 'webpack.config' // ".js" or ".json"

// instance webpack
const instanceWebpackConfigPath = path.join(BASE_DIR, webpackConfigFilename)
const instanceWebpackConfig = [
  _.get(hexo, 'config.webpack'),
  requireIgnoreMissing(instanceWebpackConfigPath)
].find(_config => validateConfig(_config))

// theme webpack
const themeWebpackConfigPath = path.join(THEME_DIR, webpackConfigFilename)
const themeWebpackConfig = [
  _.get(hexo, 'config.theme_config.webpack'),
  _.get(hexo, 'theme.config.webpack'),
  requireIgnoreMissing(themeWebpackConfigPath)
].find(_config => validateConfig(_config))

class ConfigSource {
  /**
   * @param {string} name
   * @param {object} [obj]
   */
  constructor (name, obj) {
    this.name = name
    this.config = obj
    this.valid = false
  }

  validate () {
    
  }
}

/**
 * @param {WebpackTargetConfig} [config]
 * @return {boolean}
 */
function validateConfig (config) {
  if (!config) return false
  if (!config.entry) {
    hexo.log.warn('Missing')
    return false
  }
}

/**
 * @typedef {Record<string, any>} WebpackTargetConfig
 */
/**
 * entry paths resolution
 * @param {Array<WebpackTargetConfig>} configs
 * @param {string} base
 * @return {Array<WebpackTargetConfig>}
 */
function resolveEntryPath (configs, base) {
  return configs.map(_config => {
    (_config.entry)
    return {}
  })
}

module.exports = {
  instance: instanceWebpackConfig,
  theme: themeWebpackConfig
}

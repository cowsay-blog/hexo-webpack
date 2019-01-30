const path = require('path')
const chalk = require('chalk')
const _ = require('./lodash')

const {
  requireIgnoreMissing,
  castArray,
  resolveWebpackEntry,
  resolveWebpackOutput
} = require('./utils')

module.exports = function getConfig (hexo) {
  /**
   * @typedef {Record<string, any>} WebpackTargetConfig
   */
  class Config {
    /**
     * @param {string} source
     * @param {() => WebpackTargetConfig} getConfig
     */
    constructor (source, getConfig) {
      this.source = source
      this.getter = getConfig
    }

    validate () {
      if (!this.value) { // lazy load
        this.value = this.getter()
      }

      if (!this.value) return false
      if (!this.value.entry) {
        hexo.log.error(
          `[hexo-webpack] ` +
            chalk`Missing field: "{green entry}". {grey (Source: "%s")}`,
          this.source
        )
        return false
      }
      const entryType = typeof this.value.entry
      if (entryType !== 'object' && entryType !== 'string') {
        hexo.log.error(
          `[hexo-webpack] ` +
            chalk`Invalid field "{green entry}". ` +
            chalk`Expect string, string[] or Record<string, string>, got "{magenta %s}". ` +
            chalk`{grey (Source: "%s")}`,
          entryType,
          this.source
        )
        return false
      }
      return true
    }

    /**
     * @return {WebpackTargetConfig[]}
     */
    resolve () {
      if (typeof this.value !== 'object') return null
      const base = [
        Config.sources.INSTANCE,
        Config.sources.INSTANCE_WEBPACK
      ].includes(this.source) ? SOURCE_DIR : path.join(THEME_DIR, 'source')
      return castArray(this.value)
        .map(resolveWebpackEntry.bind(null, base))
        .map(resolveWebpackOutput)
    }
  }

  Config.sources = {
    INSTANCE: '_config.yml > webpack',
    INSTANCE_WEBPACK: 'webpack.config.js*',
    INSTANCE_THEME_CONFIG: '_config.yml > theme_config.webpack',
    THEME: '<theme_dir>/_config.yml > webpack',
    THEME_WEBPACK: '<theme_dir>/webpack.config.js*'
  }

  const {
    base_dir: BASE_DIR,
    theme_dir: THEME_DIR,
    source_dir: SOURCE_DIR
  } = hexo

  const webpackConfigFilename = 'webpack.config' // ".js" or ".json"

  // instance webpack
  const instanceWebpackConfigPath = path.join(BASE_DIR, webpackConfigFilename)
  const instanceWebpackConfig = [
    new Config(
      Config.sources.INSTANCE,
      () => _.get(hexo, 'config.webpack')
    ),
    new Config(
      Config.sources.INSTANCE_WEBPACK,
      () => requireIgnoreMissing(instanceWebpackConfigPath)
    )
  ].find(
    _config => _config.validate()
  )

  // theme webpack
  const themeWebpackConfigPath = path.join(THEME_DIR, webpackConfigFilename)
  const themeWebpackConfig = [
    new Config(
      Config.sources.INSTANCE_THEME_CONFIG,
      () => _.get(hexo, 'config.theme_config.webpack')
    ),
    new Config(
      Config.sources.THEME,
      () => _.get(hexo, 'theme.config.webpack')
    ),
    new Config(
      Config.sources.THEME_WEBPACK,
      () => requireIgnoreMissing(themeWebpackConfigPath)
    )
  ].find(
    _config => _config.validate()
  )

  return {
    instance: instanceWebpackConfig && instanceWebpackConfig.resolve(),
    theme: themeWebpackConfig && themeWebpackConfig.resolve()
  }
}

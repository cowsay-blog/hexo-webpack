module.exports = function installPlugins (plugins = [], config = {}) {
  return Object.assign(config, {
    plugins: Array.isArray(config.plugins) ? config.plugins.concat(plugins) : plugins
  })
}

const Promise = require('bluebird')
const chalk = require('chalk')

const logger = require('./logger').init(hexo)
const config = require('./config')(hexo)

const webpack = require('./webpack')
const mfs = require('./mfs')
const cache = require('./cache')
const WebpackDependency = require('./models/WebpackDependency')

const { toHexoRoute } = require('./utils')

const bundledModules = new Set()
const outputRoutes = new Set()

hexo.on('ready', function () {
  // register WebpackDependency model
  hexo.database.model('WebpackDependency', WebpackDependency(hexo))
})

hexo.extend.generator.register('webpack', async function () {
  const cachedRoutes = []

  return Promise.all([].concat(config.instance, config.theme))
    .filter(Boolean)
    .filter(webpackConfig => {
      // temporarily store configs whose caches are still effective
      // to escape from webpack processing
      if (cache.validate(hexo, webpackConfig)) {
        cachedRoutes.push({
          path: '',
          data: {
            modified: false
          }
        })
        return false // escaped
      }
      return true
    })
    .map((webpackConfig) => webpack.installPlugins(
      [
        new webpack.ForEachModulePlugin(function ({ request }) {
          bundledModules.add(request)
        })
      ],
      webpackConfig
    ))
    .map(webpack.compile)
    .map(mfs.toRoutes)
    .reduce((arr, routes) => { // flatten
      return Array.isArray(routes) ? arr.concat(routes) : [ ...arr, routes ]
    }, [])
    .concat(cachedRoutes) // restore those cached routes
    .map((route) => { // record the output route
      outputRoutes.add(route.path)
      logger.info(chalk`Webpack output: "{green %s}"`, route.path)
      return route
    })
})

hexo.extend.filter.register('after_generate', function () {
  return Promise.map(
    Array.from(bundledModules),
    (_module) => {
      const relpath = toHexoRoute(_module, hexo)

      if (relpath && !outputRoutes.has(relpath)) { // local dependency
        logger.info(chalk`Trim: "{green %s}"`, relpath)
        return hexo.route.remove(relpath)
      }
    }
  )
})

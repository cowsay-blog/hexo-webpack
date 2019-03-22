const Promise = require('bluebird')
const path = require('path')
const chalk = require('chalk')
const isPathInside = require('is-path-inside')

const logger = require('./logger').init(hexo)
const getConfig = require('./config')

const webpack = require('./webpack')
const mfs = require('./mfs')

const bundledModules = new Set()
const outputRoutes = new Set()

const THEME_SOURCE_DIR = path.resolve(hexo.theme_dir, 'source')
const INSTANCE_SOURCE_DIR = path.resolve(hexo.source_dir)

hexo.extend.generator.register('webpack', function () {
  const config = getConfig(hexo)
  return Promise.all(
    [].concat(config.instance, config.theme)
  )
    .filter(Boolean)
    .map((webpackConfig) => webpack.installPlugins(
      [
        new webpack.ForEachModulePlugin(function ({ request }) {
          if (typeof request === 'string' && request.length > 0) { // may be undefined
            bundledModules.add(request)
          }
        })
      ],
      webpackConfig
    ))
    .map(webpack.compile)
    .map(mfs.toRoutes)
    .reduce((arr, routes) => { // flatten
      return Array.isArray(routes) ? arr.concat(routes) : [ ...arr, routes ]
    }, [])
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
      const relpath = isPathInside(_module, THEME_SOURCE_DIR)
        ? path.relative(THEME_SOURCE_DIR, _module)
        : isPathInside(_module, INSTANCE_SOURCE_DIR)
          ? path.relative(INSTANCE_SOURCE_DIR, _module)
          : ''
      if (relpath && !outputRoutes.has(relpath)) { // local dependency
        logger.info(chalk`Trim: "{green %s}"`, relpath)
        return hexo.route.remove(relpath)
      }
    }
  )
})

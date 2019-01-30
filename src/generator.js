const getConfig = require('./config')
const compile = require('./compile')
const mfsToRoute = require('./mfs')

const Promise = require('bluebird')
module.exports = function generator () {
  const config = getConfig(this)

  return Promise.all(
    [].concat(config.instance, config.theme)
  )
    .filter(Boolean)
    .map(compile.bind(null, this))
    .map(mfsToRoute.bind(null, this))
    .reduce((arr, routes) => { // flatten
      return Array.isArray(routes) ? arr.concat(routes) : [ ...arr, routes ]
    }, [])
}

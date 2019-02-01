const fs = require('fs')
const path = require('path')
const Promise = require('bluebird')
const chalk = require('chalk')
const { HashStream } = require('hexo-util')
const streamToString = require('stream-to-string')

const lstatAsync = Promise.promisify(fs.lstat)
const logger = require('./logger')

async function validate (hexo, config) {
  const Cache = hexo.model('Cache')
  const relPath = path.relative(hexo.base_dir, config.entry)
    .replace(/\\/g, '/')

  const entryCache = Cache.findById(relPath)
  const stat = await lstatAsync(config.entry)

  if (entryCache) { // has cache
    if (stat.mtime.getTime() === entryCache.modified) { // not even be modified
      logger.debug(chalk`Cache hits: "{green %s}"`, relPath)
      return true
    }
  }
  // const hash = await streamToString(
  //   fs.createReadStream(config.entry, 'utf8')
  //     .pipe(new HashStream())
  // )

  return true
}

module.exports = {
  validate
}

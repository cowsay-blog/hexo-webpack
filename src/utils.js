const path = require('path')
const isPathInside = require('is-path-inside')

/**
 * @param {string} pkg
 * @param {any} [defaultValue]
 */
function requireIgnoreMissing (pkg, defaultValue) {
  try {
    return require(pkg)
  } catch (e) {
    return defaultValue
  }
}

function toPosixLikeAbs (filepath) {
  const { root } = path.parse(filepath)
  return filepath.replace(root, '/').replace(path.sep, '/')
}

/**
 * @param {any} obj
 * @return {Array<any}
 */
function castArray (obj) {
  return Array.isArray(obj) ? obj : [ obj ]
}

function toHexoRoute (pathlike, hexo) {
  const THEME_SOURCE_DIR = path.resolve(hexo.theme_dir, 'source')
  const INSTANCE_SOURCE_DIR = path.resolve(hexo.source_dir)
  pathlike = path.resolve(pathlike)

  return isPathInside(pathlike, THEME_SOURCE_DIR)
    ? path.relative(THEME_SOURCE_DIR, pathlike)
    : isPathInside(pathlike, INSTANCE_SOURCE_DIR)
      ? path.relative(INSTANCE_SOURCE_DIR, pathlike)
      : ''
}

module.exports = {
  requireIgnoreMissing,
  castArray,
  toPosixLikeAbs,
  toHexoRoute
}

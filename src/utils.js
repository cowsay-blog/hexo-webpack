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
 * @return {Array<any>}
 */
function castArray (obj) {
  return Array.isArray(obj) ? obj
    : typeof obj[Symbol.iterator] === 'function' && typeof obj !== 'string' ? Array.from(obj)
      : [ obj ]
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

function isSet (set) {
  return set instanceof Set
}

/**
 * @param {Set} set1
 * @param {Set} set2
 */
function isSetEqual (set1, set2, isItemEqual = (item1, item2) => item1 === item2) {
  if (!isSet(set1) || !isSet(set2)) return set1 === set2
  if (set1.size !== set2.size) return false

  const arr1 = Array.from(set1)
  const arr2 = Array.from(set2)

  for (let item1 in arr1) {
    if (!arr2.find(
      item2 => isItemEqual(item1, item2)
    )) {
      return false
    }
  }

  return true
}

module.exports = {
  requireIgnoreMissing,
  castArray,
  toPosixLikeAbs,
  toHexoRoute,
  isSetEqual
}

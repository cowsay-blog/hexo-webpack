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

/**
 * @param {any} obj
 * @return {Array<any}
 */
function castArray (obj) {
  return Array.isArray(obj) ? obj : [ obj ]
}

module.exports = {
  requireIgnoreMissing,
  castArray
}

const { SchemaType } = require('warehouse')
const ValidationError = require('warehouse/lib/error/validation')

const { castArray, isSetEqual } = require('../../utils')

module.exports = class SchemaTypeSet extends SchemaType {
  constructor (name, options) {
    super(name, Object.assign({ default: new Set() }, options))
    /**
     * @type {SchemaType}
     */
    this.child = this.options.child || new SchemaType(name)
  }

  cast (value, data) {
    value = super.cast(value, data)
    if (value === null) return value
    if (value instanceof Set) return value
    return new Set(castArray(value))
  }

  /**
   * @param {Set} a
   * @param {Set} b
   */
  compare (a, b) {
    if (!a && !b) return 0
    if (a && !b) return 1
    if (!a && b) return -1

    const arrA = Array.from(a)
    const arrB = Array.from(b)
    const lenA = arrA.length
    const lenB = arrB.length

    for (let i = 0; i < lenA && i < lenB; i++) {
      const result = this.child.compare(arrA[i], arrB[i])
      if (result !== 0) return result
    }

    return lenA - lenB
  }

  /**
   * The same set of items may in different order
   * @param {Set} value
   * @param {Set} query
   * @param {object} data
   */
  match (value, query, data) {
    return isSetEqual(value, query, (item1, item2) => this.child.match(item1, item2, data))
  }

  parse (value, data) {
    return !Array.isArray(value) ? value : new Set(
      value.map(v => this.child.parse(v, data))
    )
  }

  /**
   * @param {Set} value
   * @param {object} data
   */
  value (value, data) {
    return !Array.isArray(value) ? value : Array.from(value).map(v => this.child.value(v, data))
  }

  validate (_value, data) {
    const value = super.validate(_value, data)

    if (!Array.isArray(value) && !(value instanceof Set)) {
      throw new ValidationError(`\`${value}\` is neither an array nor a Set!`)
    }

    const result = []

    for (let item of value) {
      result.push(this.child.validate(item, data))
    }

    return new Set(result)
  }

  /**
   * @param {Set} value
   * @param {number} query
   */
  q$size (value, query) {
    return (value ? value.size : 0) === query
  }

  /**
   * @param {Set} value
   * @param {any} query
   */
  q$has (value, query) {
    if (!value) return false
    return value.has(query)
  }

  /**
   * @param {Set} value
   * @param {Set[]} queries
   */
  q$in (value, queries, data) {
    if (!value) return false
    for (let query of queries) {
      if (isSetEqual(
        value, query, (item1, item2) => this.child.match(item1, item2, data)
      )) {
        return true
      }
    }
    return false
  }

  /**
   * @param {Set} value
   * @param {Set[]} queries
   */
  q$nin (value, queries, data) {
    if (!value) return true
    for (let query of queries) {
      if (isSetEqual(
        value, query, (item1, item2) => this.child.match(item1, item2, data)
      )) {
        return false
      }
    }
    return true
  }

  /**
   * @param {Set} value
   * @param {any} update
   */
  u$add (value, update) {
    if (!value) value = new Set()
    return value.add(update)
  }

  /**
   * @param {Set} value
   */
  u$clear (value) {
    if (value) value.clear()
    return value
  }

  /**
   * @param {Set} value
   * @param {any} update
   */
  u$delete (value, update) {
    if (value) {
      value.delete(update)
    }
    return value
  }
}

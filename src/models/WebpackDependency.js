const { Schema } = require('warehouse')

const SchemaTypeSet = require('./types/SchemaTypeSet')

module.exports = function () {
  const WebpackDependency = new Schema({
    entry: SchemaTypeSet,
    dependency: SchemaTypeSet
  })

  WebpackDependency.static('findByEntry', function (entry, options) {
    const _options = Object.assign({ one: true }, options)
    return _options.one ? this.findOne({ entry }, options) : this.find({ entry }, options)
  })

  return WebpackDependency
}

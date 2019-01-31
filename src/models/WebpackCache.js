const { Schema } = require('warehouse')

module.exports = function () {
  const WebpackCache = new Schema({
    entry: {
      type: String,
      required: true
    },
    children: [String]
  })
}

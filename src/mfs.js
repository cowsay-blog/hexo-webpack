const traverse = require('traverse')

function toRoutes (mfs) {
  const paths = []
  traverse(mfs.data).forEach(function () {
    if (Buffer.isBuffer(this.node)) {
      this.block()
    }
    if (!this.isRoot) {
      paths.push(this.path)
    }
  })

  return paths.map(p => {
    const _path = p.join('/')
    return {
      path: _path,
      data: () => mfs.readFileSync('/' + _path)
    }
  })
}

module.exports = {
  toRoutes
}

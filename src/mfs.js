const traverse = require('traverse')
const path = require('path')

function toRoutes (mfs) {
  const paths = []
  traverse(mfs.data).forEach(function () {
    if (Buffer.isBuffer(this.node)) {
      this.block()
    }

    const absPath = '/' + this.path.join('/')
    if (!this.isRoot && mfs.statSync(absPath).isFile()) {
      paths.push(absPath)
    }
  })

  return paths.map(p => {
    return {
      path: path.relative('/', p),
      data: () => mfs.readFileSync(p)
    }
  })
}

module.exports = {
  toRoutes
}

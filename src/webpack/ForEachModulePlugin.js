module.exports = class ForEachModulePlugin {
  constructor (fn = function () {}) {
    this.fn = fn
  }

  apply (compiler) {
    compiler.hooks.compilation.tap('ForEachModulePlugin', (compilation) => {
      compilation.hooks.finishModules.tap('ForEachModulePlugin', (modules) => {
        if (Array.isArray(modules)) {
          modules.forEach(this.fn)
        }
      })
    })
  }
}

const generator = require('./generator')

hexo.extend.generator.register('webpack', generator)
hexo.extend.filter.register('after_generate', function () {
  // delete entry files from routes
})

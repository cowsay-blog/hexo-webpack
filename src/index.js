hexo.extend.generator.register('webpack', function () {
  // use cache to compare hash of entries
  console.log(this.model('Cache'))
  // Model {
  //   data: { 'source/_posts/hello-world.md': {
  //       _id: 'source/_posts/hello-world.md',
  //       hash: '8a02477044e2b77f1b262da2c48c01429e4a32e4',
  //       modified: 1547806831312
  //     }
  //   }
  // }

  // provide routes for output files
  return {
    path: 'hello.txt',
    data: () => 'hello'
  }
})

hexo.on('generateAfter', function () {
  // delete entry files from routes
})

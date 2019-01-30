
// function (compiler) {
//   compiler.plugin('compilation', function(compilation, params) {
//       compilation.plugin('after-optimize-chunk-assets', function(chunks) {
//           console.log(
//               chunks.map(function(c) {
//                   return {
//                       id: c.id,
//                       name: c.name,
//                       includes: c.modules.map(function(m) {
//                           return m.request;
//                       })
//                   };
//               })
//           );
//       });
//   });
// };

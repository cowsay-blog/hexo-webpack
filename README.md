# hexo-Webpack
Yet another Hexo plugin to enable awesome Webpack package system in your Hexo site.

- [hexo-Webpack](#hexo-webpack)
  - [Why not? 🤔](#why-not-%F0%9F%A4%94)
    - [What's the difference if using `hexo-Webpack`?](#whats-the-difference-if-using-hexo-webpack)
    - [Why not give a PR to the existing repo?](#why-not-give-a-pr-to-the-existing-repo)
    - [Core concepts of hexo-Webpack 💡](#core-concepts-of-hexo-webpack-%F0%9F%92%A1)

## Why not? 🤔
- [hexo-renderer-Webpack](https://github.com/briangonzalez/hexo-renderer-webpack)
- [hexo-renderer-Webpack4](https://github.com/segayuu/hexo-renderer-webpack)

The most significant reason is that, you cannot provide a logical condition when configuring Webpack because both of the 2 plugins only support configurations from Hexo's YAML config files (global `_config.yml` and theme `_config.yml`).
Therefore you lose support from Webpack plugins in Hexo.

### What's the difference if using `hexo-Webpack`?
- Support for `Webpack.config.js` or `Webpack.config.json`
  > `Webpack.config.js` is recommended in [the official site of Webpack](https://webpack.js.org/configuration/).
- Hierarchical configuration between global Hexo instance and theme
  > That is, a theme can have its own `Webpack.config.js` to bundle its own javascript in `<hexo_root>/themes/<theme_name>/source`, while the global Hexo instace can have another Webpack config to handle javascript files in the `<hexo_root>/source`.

  > If the theme author cannot handle how his Webpack config will be, he cannot even predict where his javascript files will be after generated! 🤣

- Context-aware entry path resolution
  > That is, if the Webpack config is from the theme, the entry path(s) is (are) resolved from the theme's source folder (`<hexo_root>/themes/<theme_name>/source`), and if the config is from global, entry path(s) is (are) resolved from `<hexo_root>/source`.

### Why not give a PR to the existing repo?
I've try to support the features listed above in `hexo-renderer-Webpack4`; however, unexpected behavior occurs when testing hierarchical configuration with [multiple Webpack targets](https://webpack.js.org/configuration/configuration-types/#exporting-multiple-configurations). Files from themes were not rendered when the promise of `Hexo#load()` resolved.

In the situation of multiple Webpack targets, given the same entry file `a.js` will be rendered into multiple files specified by [`output`](https://webpack.js.org/configuration/output/) in each target config. However, the both plugins listed above are all Hexo renderers, which is designed to be reactive and 1-1 file rendering.

### Core concepts of hexo-Webpack 💡
- Proactively parse Webpack config files and expect the output folder structure in advanced.
- Source files will not be in the output folder (i.e. `public`), only bundled files will be.
- Render each file according to the corresponding Webpack config in the hierarchy.
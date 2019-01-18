# hexo-webpack
Yet another Hexo plugin to enable awesome Webpack package system in your Hexo site.

[![Build Status](https://travis-ci.org/cowsay-blog/hexo-webpack.svg?branch=master)](https://travis-ci.org/cowsay-blog/hexo-webpack)
[![npm](https://img.shields.io/npm/v/hexo-webpack.svg)](https://www.npmjs.com/hexo-webpack)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Gitmoji](https://img.shields.io/badge/gitmoji-%20😜%20😍-FFDD67.svg?style=flat-square)](https://gitmoji.carloscuesta.me/)

- [hexo-webpack](#hexo-webpack)
  - [Features](#features)
  - [Why not? 🤔](#why-not-)
    - [About Hexo renderers 🎨](#about-hexo-renderers-)
    - [Core concepts 💡](#core-concepts-)
  - [Documentation](#documentation)
    - [Terminology](#terminology)
      - [*contextual configuration*](#contextual-configuration)
      - [*instance*](#instance)
      - [*instance config*](#instance-config)
      - [*instance webpack config*](#instance-webpack-config)
      - [*theme*](#theme)
      - [*theme config*](#theme-config)
      - [*theme webpack config*](#theme-webpack-config)
    - [Configuration precedence](#configuration-precedence)
      - [For the instance](#for-the-instance)
      - [For the theme](#for-the-theme)
    - [Path resolution](#path-resolution)
      - [Entry paths](#entry-paths)
      - [Output paths](#output-paths)

## Features
- Support for conventional `webpack.config.js*`
  > `webpack.config.js` is recommended by [Webpack official](https://webpack.js.org/configuration/).

- Contextual configuration ([*instance webpack config*](#instance-webpack-config) or [*theme webpack config*](#theme-webpack-config))
  > If the theme author cannot handle the webpack config of his/her theme, he/she cannot even find his/her javascript files to include theme into templates! 🤣

- Contextual entry path resolution
  > Along with the contextual configuration, webpack entries should also be resolved from their context!

## Why not? 🤔
- [hexo-renderer-Webpack](https://github.com/briangonzalez/hexo-renderer-webpack)
- [hexo-renderer-Webpack4](https://github.com/segayuu/hexo-renderer-webpack)

The most significant reason is that, you cannot provide a **logical condition** when configuring Webpack because both of the 2 plugins only support static configuration, that is, Hexo's YAML config files.
Besides, you lose the support from awesome [**Webpack plugins**](https://webpack.js.org/concepts/plugins/#configuration) in Hexo.

### About Hexo renderers 🎨
Renderering a file sounds like performing transformation to a file and it should be a 1-to-1 relationship between the source file and the rendered file.

However, in Webpack, you can configure [multiple targets](https://webpack.js.org/concepts/targets/#multiple-targets) for the same entrypoint which results in a 1-to-several relationship.

Therefore, not to be offensive to anyone but for a better experience *webpacking* in Hexo, I don't think renderer is a proper way to integrate Webpack with Hexo.

### Core concepts 💡
> 🚧 To be continued...

## Documentation
### Terminology
Frequently used terms in this document are defined here.

#### *contextual configuration*
Configuration that is aware of where the config file is, that is, in the instance or in a theme.
#### *instance*  
Your hexo instance, everything about your site, including posts, pages, data assets, scripts, source files, etc.
#### *instance config*  
Referred to `<hexo_root>/_config.yml`.
#### *instance webpack config*  
Referred to `<hexo_root>/webpack.config.js*`.
#### *theme*  
The theme for your hexo instance, placed under `<hexo_root>/themes/<theme_name>/`, including templates, data assets, scripts, source files, etc.
#### *theme config*  
Referred to `<hexo_root>/themes/<theme_name>/_config.yml`.
#### *theme webpack config*  
Referred to `<hexo_root>/themes/<theme_name>/webpack.config.js*`.

### Configuration precedence
Configuration may be done at several places as shown in the table below.
Rows in the table are in descending precedence;
that is, the first valid config found is the effective one.

> No configuration merging accross the listed places are performed in order to keep the configuration processing simple.
> It's recommended to decide one place and place all necessary configs in the chosen place.

#### For the instance

| Precedence    | File                             | Config Key |
|---------------|----------------------------------|------------|
| 1 (*highest*) | `<hexo_root>/_config.yml`        | `webpack`  |
| 0 (*lowest*)  | `<hexo_root>/webpack.config.js*` |            |    

#### For the theme

| Precedence    | File                                                 | Config Key                                             |
|---------------|------------------------------------------------------|--------------------------------------------------------|
| 2 (*highest*) | `<hexo_root>/_config.yml`                            | `theme_config.webpack`                                 |
| 1             | `<hexo_root>/themes/<theme_name>/_config.yml`        | `webpack`                                            | |
| 0 (*lowest*)  | `<hexo_root>/themes/<theme_name>/webpack.config.js*` |                                                        |

### Path resolution
#### Entry paths
Each entry path is resolved from the `source/` folder of its context; that is, an entry in the *theme webpack config* is resolved from `<hexo_root>/themes/<theme_name>/source/` while an entry in the *instance webpack config* is resolved from `<hexo_root>/source/`.

#### Output paths
All output path are resolved under `<hexo_root>/public/`.

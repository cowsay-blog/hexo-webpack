// config
const OWNER = 'cowsay-blog'
const REPO = 'hexo-webpack'

const tagLink = `https://github.com/${OWNER}/${REPO}/hexo-webpack/releases/tag/\${nextRelease.gitTag}`
const message = `:bookmark: v\${nextRelease.version} [skip ci]\n\n${tagLink}`

module.exports = {
  plugins: [
    'semantic-release-gitmoji',
    '@semantic-release/github',
    '@semantic-release/npm',
    [ '@semantic-release/git', { message } ]
  ]
}

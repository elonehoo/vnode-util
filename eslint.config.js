const antfu = require('@antfu/eslint-config').default

module.exports = antfu({
  ignores: [
    'dist',
    'public',
    '.github',
    '.vscode',
    'docs',
  ],
})

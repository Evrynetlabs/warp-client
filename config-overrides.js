/* config-overrides.js */
const path = require('path')

module.exports = function override(config) {
  //do stuff with the webpack config...
  return {
    ...config,
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src/'),
        Components: path.resolve(__dirname, 'src/components/'),
      },
    },
  }
}

const prodServer = require('./prod')
const devServer = require('./dev')

if (process.env.NODE_ENV === 'development') {
  devServer.run()
} else {
  prodServer.run()
}

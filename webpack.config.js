var path = require('path')
var webpack = require('webpack')

module.exports = function (options) {
  var rootDir = path.resolve(__dirname, 'src', 'js')

  // Initialize conf.
  var conf = {
    cache: true,
    context: rootDir,
    entry: {
      app: [
        './app'
      ],
      vendors: [
        'babel/polyfill',
        'lodash',
        'react',
        'react-redux',
        'redux'
      ]
    },
    output: {
      path: path.resolve(__dirname, 'build'),
      filename: 'js/app.js',
      publicPath: '/'
    },
    resolve: {
      extensions: ['', '.js', '.jsx']
    },
    module: {
      loaders: [
        { test: /\.js?$/, loaders: ['babel'], include: rootDir }
      ]
    },
    plugins: [
      new webpack.NoErrorsPlugin(),
      new webpack.optimize.CommonsChunkPlugin('vendors', 'js/vendors.js')
    ]
  }

  // Set root.
  conf.root = rootDir

  // Enable sourcemaps.
  conf.devtool = 'sourcemap'

  // Production.
  if (options.production) {
    conf.plugins = conf.plugins.concat(
      new webpack.DefinePlugin({
        'process.env': {
          'BROWSER': JSON.stringify(true),
          'NODE_ENV': JSON.stringify('production')
        }
      }),
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.OccurenceOrderPlugin(true),
      new webpack.optimize.UglifyJsPlugin({compress: {warnings: false}})
    )
  }

  // Development Sever.
  if (options.development) {
    conf.debug = true
    conf.entry.app = conf.entry.app.concat([
      'webpack-hot-middleware/client'
    ])
    conf.plugins = conf.plugins.concat([
      new webpack.DefinePlugin({
        'process.env': {
          'BROWSER': JSON.stringify(true),
          'NODE_ENV': JSON.stringify('development')
        }
      }),
      new webpack.HotModuleReplacementPlugin()
    ])
  }

  return conf
}

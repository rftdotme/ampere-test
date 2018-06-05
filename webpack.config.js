var path = require('path')
var webpack = require('webpack')
var CompressionPlugin = require("compression-webpack-plugin")

module.exports = {
  entry: [    
    path.join(__dirname, '/src/app.js')
  ],
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: '/dist/',
    filename: 'build.js'
  },
  module: {

    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
          }
          // other vue-loader options go here
        }
      },
      { 
        test: /\.js$/,
        loader: 'babel-loader',        
        exclude: /node_modules/
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]'
        }
      }
    ]
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    }
  },
  configureWebpack: {
    plugins: [
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'window.jQuery': 'jquery'
      })
    ]
  },
  node: {
    console: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  },
  performance: {
    hints: false
  },
  devtool: '#eval-source-map'  
}

module.exports.devtool = '#source-map'
module.exports.plugins = (module.exports.plugins || []).concat([
  new webpack.optimize.OccurrenceOrderPlugin(),
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: '"production"'
    }
  }),
  new webpack.optimize.UglifyJsPlugin({
    sourceMap: true,
    beautify: false,
    comments: false,
    compress: {
      sequences     : true,
      booleans      : true,
      loops         : true,
      unused      : true,
      warnings    : false,
      drop_console: true,
      unsafe      : true
    }
  }),
  new CompressionPlugin({
    asset: "[path].gz[query]",
    algorithm: "gzip",
    test: /\.(js|css|html|svg)$/,
    threshold: 10240,
    minRatio: 0.8
  }),
  new webpack.LoaderOptionsPlugin({
    minimize: true
  })
])
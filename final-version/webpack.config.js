var path = require('path');
var webpack = require('webpack');

module.exports = {

  devtool: 'source-map',
  entry: [
    'webpack-hot-middleware/client',
    './final-version/src/scripts/main.js'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/static/',
    filename: 'main.js',
  },
  stats: {
    colors: true,
    chunkModules: false
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],

  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loaders: ['babel'],
        exclude: [/node_modules/],
        include: path.join(__dirname, 'src')
      },
      {
        test: /\.scss$/,
        include: path.join(__dirname, 'src'),
        loaders: ['style','css', 'sass']
      }
    ]
  }

};
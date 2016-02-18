var path = require('path');
var webpack = require('webpack');

module.exports = {

  devtool: 'source-map',
  entry: [
    './src/scripts/main.js'
  ],
  output: {
    path: path.join(__dirname 'dist',
    publicPath: '/static/',
    filename: 'main.js',
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': "'production'"
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false
      }
    })
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
        loader: 'style-loader!css-loader!stylus-loader'
      }
    ]
  }

};
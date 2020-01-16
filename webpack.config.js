var path = require('path');
var webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const WebpackPluginPluginConfig = new HtmlWebpackPlugin({
  template: './views/index.html',
  filename: 'index.html',
  inject: 'body'
});

const CopyWebpackPluginConfig = new CopyWebpackPlugin([
  { from: './views/style.css', to: path.resolve(__dirname, 'public') },
  { from: './views/images', to: path.resolve(__dirname, 'public', 'images') },
//  { from: './views/service-worker.js', to: path.resolve(__dirname, 'public') },
//  { from: './views/favicon.ico', to: path.resolve(__dirname, 'public') },
//  { from: './views/logo128.png', to: path.resolve(__dirname, 'public') },
//  { from: './views/logo256.png', to: path.resolve(__dirname, 'public') },
//  { from: './views/logo512.png', to: path.resolve(__dirname, 'public') },
//  { from: './views/manifest.json', to: path.resolve(__dirname, 'public') },
//  { from: './views/robots.txt', to: path.resolve(__dirname, 'public') },
//  { from: './views/404.html', to: path.resolve(__dirname, 'public') },
//  { from: './views/500.html', to: path.resolve(__dirname, 'public') }
]);


module.exports = {
  entry: './views/bundle.jsx',
  output: {
    path: __dirname + '/public',
    filename: 'bundle.js'
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json']
  },
  module: {
    rules: [{
      test: /.jsx?$/,
      loader: 'babel-loader',
      exclude: /node_modules/,
      query: {
        cacheDirectory: true,
        presets: ['es2015', 'es2017', 'stage-0', 'react']
      }
    }, {
      test: /\.css$/,
      loader: 'style-loader!css-loader!sass-loader'
    },
    {
      test: /\.s[ac]ss$/i,
      use: [
        // Creates `style` nodes from JS strings
        'style-loader',
        // Translates CSS into CommonJS
        'css-loader',
        // Compiles Sass to CSS
        'sass-loader',
      ],
    },
    {
      test: /\.(jpe?g|gif|png|svg)$/i,
      use: [
        {
          loader: 'url-loader',
          options: {
            limit: 10000
          }
        }
      ]
    }
  ]
  },
  plugins: [
    WebpackPluginPluginConfig,
    CopyWebpackPluginConfig
  ]
};
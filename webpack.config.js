/*!
 * Webpack config
 * xiewulong <xiewulong@vip.qq.com>
 * create: 2018/07/25
 * since: 0.0.1
 */
'use strict';

const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const WebpackMiniCssExtractPlugin = require('mini-css-extract-plugin');
const WebpackOptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const WebpackUglifyjsPlugin = require('uglifyjs-webpack-plugin');
const pkg = require('./package.json');

const base_path = __dirname;
const entry_path = `${base_path}/assets/javascripts`;
const output_path = `${base_path}/public/assets/js`;

let entries = {};
fs.readdirSync(entry_path).forEach(filename => {
  if (!fs.statSync(`${entry_path}/${filename}`).isFile()) return;

  let name = path.parse(filename).name;
  entries[name] = `${entry_path}/${name}`;
});

module.exports = {
  entry: entries,
  output: {
    path: output_path,
    filename: '[name].js',
  },
  resolve: {
    alias: {
      // 'vue$': 'vue/dist/vue.esm.js',
    },
    // extensions: [ '.js', '.web.js', '.webpack.js' ],
  },
  externals: {
    // axios: 'axios',
    // jquery: 'jQuery',
    // react: 'React',
    // 'react-dom': 'ReactDOM',
    // vue: 'Vue',
    // 'vue-router': 'VueRouter',
    // vuex: 'Vuex',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          WebpackMiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
        ],
      },
      {
        test: /\.scss$/,
        use: [
          WebpackMiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.js$/,
        use: ['babel-loader'],
        exclude: /node_modules/,
      },
      {
        test: /\.(gif|jpe?g|png)(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              fallback: 'file-loader',
              limit: 8192,
              name: '../images/[name].[ext]',
            },
          },
        ],
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              fallback: 'file-loader',
              limit: 8192,
              name: '../fonts/[name].[ext]',
            },
          },
        ],
      },
    ],
  },
  optimization: {
    minimizer: [
      new WebpackUglifyjsPlugin({
        uglifyOptions: {
          output: { comments: false },
          ie8: false,
        },
      }),
      new WebpackOptimizeCSSAssetsPlugin({
        cssProcessorOptions: { discardComments: { removeAll: true } },
      }),
    ],
    splitChunks: {
      cacheGroups: {
        common: {
          chunks: chunk => [ 'api' ].indexOf(chunk.name) == -1,
          minChunks: 2,
          minSize: 1,
          name: 'common',
        },
      },
    },
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new WebpackMiniCssExtractPlugin({ filename: '../css/[name].css' }),
  ],
};

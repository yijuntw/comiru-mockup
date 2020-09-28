import webpack from 'webpack'

import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import HTMLWebpackPlugin from 'html-webpack-plugin' 

import commonConfig from './config.common.js'

const __CWD__ = process.cwd()

export default {
  ...commonConfig,

  entry: [...commonConfig.entry, 'webpack-hot-middleware/client'],

  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new MiniCssExtractPlugin({ filename: '[name].[hash].css', }),

    new HTMLWebpackPlugin({
      template: './src/static/index.html',
      filename: 'index.html',
      scriptLoading: 'defer',
      inject: 'head',
    }),
  ],
}


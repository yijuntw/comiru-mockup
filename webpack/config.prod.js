import webpack from 'webpack'

import cleaner from 'clean-webpack-plugin'
import TerserWebpackPlugin from 'terser-webpack-plugin'
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import HTMLWebpackPlugin from 'html-webpack-plugin' 

import commonConfig from './config.common.js'

const { CleanWebpackPlugin } = cleaner

export default {
  ...commonConfig,

  optimization: {
    chunkIds: "named",

    minimizer: [
      new TerserWebpackPlugin({}),
      new OptimizeCSSAssetsPlugin({}),
    ],

		splitChunks: {
			cacheGroups: {
				commons: {
					chunks: "initial",
					minChunks: 2,
					maxInitialRequests: 5, // The default limit is too small to showcase the effect
					minSize: 0, // This is example is too small to create commons chunks
				},
				vendor: {
					test: /node_modules/,
					chunks: "initial",
					name: "vendor",
					priority: 10,
					enforce: true,
				},
			},
		},
  },

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

    new CleanWebpackPlugin(),
  ],
}

import path from 'path'

import MiniCssExtractPlugin from 'mini-css-extract-plugin'

import { __CWD__, __DEV__, __PROD__, DIST_PATH } from '../constants.js'

export default {
  mode: process.env.NODE_ENV,

  entry: ['./src/main.tsx'],

  resolve: {
    modules: ['node_modules'],
    extensions: ['.tsx', '.ts', '.js', 'jsx', 'styl', 'stylus'],
    alias: {
      // JS:
      '@actions': path.resolve(__CWD__, 'src/actions/'),
      '@assets': path.resolve(__CWD__, 'src/assets/'),
      '@components': path.resolve(__CWD__, 'src/components/'),
      '@constants': path.resolve(__CWD__, 'src/constants/'),
      '@helpers': path.resolve(__CWD__, 'src/helpers/'),
      '@pages': path.resolve(__CWD__, 'src/pages/'),
      '@reducers': path.resolve(__CWD__, 'src/reducers/'),

      // Stylus:
      'constants': path.resolve(__CWD__, 'src/constants/stylus/index.styl'),
      'keyframes': path.resolve(__CWD__, 'src/constants/stylus/keyframes.styl'),
    },
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: ['babel-loader', 'ts-loader'],
        exclude: /node_module/,
      },

      {
        test: /\.jsx?$/,
        use: 'babel-loader',
        exclude: /node_module/,
      },

      {
        test: /\.(styl|stylus)$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader', 
          {
            loader: 'stylus-loader',
            options: {
              stylusOptions: {
                use: ['nib'],
                sourceMap: __DEV__,
                includeCSS: true,
                resolveURL: true,
              },
            },
          },
        ],
      },

      {
        test: /\.(png|jpg|gif|svg|ttf|woff2?|otf)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[hash].[ext]',
        },
      },
    ]
  },

  output: {
    path: DIST_PATH,
    publicPath: '/static/',
    filename: __DEV__ ? '[name].js' : '[name].[contenthash].js',
  },
}

import webpack from 'webpack'
import webpackConfig from './config.prod.js'

const packer = webpack(webpackConfig)

packer.run(
  (err, stats) => {
    if (err || stats.hasErrors()) {
      return console.error(err || stats)
    }
    console.log('Compile done.')
  },
)
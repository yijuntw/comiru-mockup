import Koa from 'koa'
import Router from 'koa-router'

import mount from 'koa-mount'
import serve from 'koa-static'
import qs from 'koa-qs'

import { promises as fs } from 'fs'
import path from 'path'
import ramda from 'ramda'
import randomId from 'random-id'
import papaparse from 'papaparse'

const { compose, join, map, range, replace, split } = ramda
const { parse: parseCSV } = papaparse

const __CWD__ = process.cwd()
const __DEV__ = process.env.NODE_ENV === 'development'
const __PROD__ = process.env.NODE_ENV === 'production'

const random = xs => xs[Math.floor(Math.random() * xs.length)]
const randomTimestamp = () => new Date() - Math.floor(Math.random() * 100000000000)

const [prodIndex, rawCities, rawWebsites, rawVideos, rawExcerpts] = await Promise.all([
  __PROD__ ? fs.readFile(path.resolve(__CWD__, 'dist/index.html'), 'utf8') : '',

  fs.readFile(path.resolve(__CWD__, 'data/cities.csv'), 'utf8'),
  fs.readFile(path.resolve(__CWD__, 'data/websites.csv'), 'utf8'),
  fs.readFile(path.resolve(__CWD__, 'data/videos.csv'), 'utf8'),
  fs.readFile(path.resolve(__CWD__, 'data/excerpts.md'), 'utf8'),
])

const places = compose (split(','), replace(/\n/) (',')) (rawCities)
const { data: websites } = parseCSV(rawWebsites, { header: true })
const covers =  map (i => `/media/${i}.jpeg`) (range (1) (35 + 1))
const videos = split (/\n/) (rawVideos)

const app = new Koa()
const router = new Router()

qs(app, 'strict')

const [packer, filename] = (
  __DEV__
  ? await (async () => {
      const { default: webpack } = await import ('koa-webpack')
      const { default: webpackConfig } = await import ('../../webpack/config.dev.js')

      return [
        await webpack ({ config: webpackConfig }),
        path.resolve(webpackConfig.output.path, 'index.html'),
      ]
    }) ()

  : [
      (_, next) => next(),
      '',
    ]
)

const appRenderer = ctx => {
  ctx.response.type = 'html'
  ctx.body = __DEV__ ? packer.devMiddleware.fileSystem.createReadStream(filename) : prodIndex
}

app.use(packer)
app.use(mount('/media', serve(path.resolve(__CWD__, 'data/covers'))))

if (__PROD__) {
  app.use(mount('/static', serve(path.resolve(__CWD__, 'dist/'))))
}

app.use(router.routes()).use(router.allowedMethods())
app.on('error', console.error)

router.get('/api/cities', async ctx => {
  ctx.body = rawCities
})

router.get('/api/articles', async ctx => {
  const count = Number(randomId(random([1 ,2, 3]), '0'))

  const keywords = compose (split (/,\s?/), replace (/\r/g) (''), join (',')) (ctx.query['keywords[]'])
  const excerpts = compose (split (/\n/), replace (/####/g, () => random (keywords))) (rawExcerpts)

  const articles = compose (
    map (() => ({
      id: randomId(10, 'a0'),
      ...random (websites),
      cover: random (covers),
      excerpt: random (excerpts),
      timestamp: randomTimestamp (),
      video: random (videos),
    }))
  ) (range (1) (count))
    
  ctx.body = articles
})

router.get('/api/article/:id', async ctx => {
  const cities = (split (/,\s?/), replace (/\r/g) (''), join (',')) (places)
  const excerpts = compose (split (/\n\n/), replace (/####/g, () => random (cities))) (rawExcerpts)

  ctx.body = {
    id: ctx.params.id,
    ...random (websites),
    cover: random (covers),
    excerpt: random (excerpts),
    timestamp: randomTimestamp (),
    video: random (videos),
  }
})

router.get('(.*)', appRenderer)

app.listen(Number(process.env.PORT || 5000))

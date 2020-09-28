import Koa from 'koa'
import Router from 'koa-router'

import mount from 'koa-mount'
import serve from 'koa-static'
import qs from 'koa-qs'

import path from 'path'
import ramda from 'ramda'

import { readFile } from './helpers.js'

import {
  DATA_CITIES,
  randArticlesWithKeywords,
  randArticle,
} from './fake-data.js'

import { __CWD__, __DEV__, __PROD__, DIST_PATH } from '../../constants.js'

const { compose, join, split } = ramda

const INDEX_PATH = path.resolve(DIST_PATH, 'index.html')
const PROD_INDEX_CONTENT = await (__PROD__ ? readFile(INDEX_PATH) : '')

const app = new Koa()
const router = new Router()

qs(app, 'strict')

const packer = (
  __DEV__
  ? await (async () => {
      const { default: webpack } = await import ('koa-webpack')
      const { default: webpackConfig } = await import ('../../webpack/config.dev.js')

      return webpack ({ config: webpackConfig })
    }) ()

  : (_, next) => next()
)

const clientAppRender = ctx => {
  ctx.response.type = 'html'

  ctx.body = (
    __DEV__
    ? packer.devMiddleware.fileSystem.createReadStream(INDEX_PATH)
    : PROD_INDEX_CONTENT
  )
}

app.use(packer)
app.use(mount('/media', serve(path.resolve(__CWD__, 'data/covers'))))

if (__PROD__) {
  app.use(mount('/static', serve(path.resolve(__CWD__, 'dist/'))))
}

app.use(router.routes()).use(router.allowedMethods())
app.on('error', console.error)

router.get('/api/cities', async ctx => {
  ctx.body = DATA_CITIES
})

router.get('/api/articles', async ctx => {
  const keywords = compose (split (/,\s?/), join (',')) (ctx.query['keywords[]'])
  ctx.body = randArticlesWithKeywords (keywords)
})

router.get('/api/article/:id', async ctx => {
  ctx.body = randArticle (ctx.params.id)
})

router.get('(.*)', clientAppRender)

app.listen(Number(process.env.PORT || 5000))

import papaparse from 'papaparse'
import ramda from 'ramda'
import randId from 'random-id'

import { __CWD__ } from '../../constants.js'
import { shuffle, randTime, readFiles } from './helpers.js'

const { compose, map, range, replace, split } = ramda
const { parse: parseCSV } = papaparse

const [DATA_CITIES, DATA_WEBSITES, DATA_VIDEOS, DATA_EXCERPTS] = await readFiles([
  'data/cities.csv',
  'data/websites.csv',
  'data/videos.csv',
  'data/excerpts.md',
])

const places = compose (split(','), replace(/\n/) (',')) (DATA_CITIES)
const covers =  map (i => `/media/${i}.jpeg`) (range (1) (35 + 1))
const videos = split (/\n/) (DATA_VIDEOS)
const { data: websites } = parseCSV(DATA_WEBSITES, { header: true })
const excerpts = split (/\n/) (DATA_EXCERPTS)

const randExcerptWithKeywords = keywords => compose (
    replace (/####/g) (shuffle (keywords)),
    shuffle,
) (excerpts)

const randArticleWithKeywords = (keywords) => () => ({
  id: randId(10, 'a0'),
  timestamp: randTime (),
  ...shuffle (websites),
  cover: shuffle (covers),
  excerpt: randExcerptWithKeywords (keywords),
  video: shuffle (videos),
})

const randArticle = (id) => ({
  id,
  timestamp: randTime (),
  ...shuffle (websites),
  cover: shuffle (covers),
  excerpt: randExcerptWithKeywords ([shuffle (places), shuffle (places)]),
  video: shuffle (videos),
})

const randCount = () => Number(randId(shuffle([1 ,2, 3]), '0'))
const randSkeleton = () => range (1) (randCount())

const randArticlesWithKeywords = (keywords) => (
  map (randArticleWithKeywords (keywords)) (randSkeleton ())
)

export {
  DATA_CITIES,
  randArticle,
  randArticlesWithKeywords,
}
import { compose, head, reduce, values } from 'ramda'

import { UPDATE_ARTICLES, UPDATE_ARTICLE, CLEAR_ARTICLES } from '@actions/articles'
import { Article } from './keywordArticlesMap'

interface Articles {
  [id: string]: Article;
}

type UpdateArticlesAction = { type: string, payload: Articles }
type UpdateArticleAction = { type: string, payload: Article }
type ClearArticlesAction = { type: string, payload: void }

type Action = UpdateArticlesAction | UpdateArticleAction | ClearArticlesAction

const initialState: Articles = {}

export default function articlesReducer(
  state: Articles = initialState,
  { type, payload }: Action,
): Articles {
  switch (type) {
    case UPDATE_ARTICLES:
      const articles = compose (head, values) (payload)
      const articlesMap = reduce ((acc: Articles, a: Article) => ({ ...acc, [a.id]: a })) ({}) (articles)
      return { ...state, ...articlesMap }

    case UPDATE_ARTICLE:
      const article = payload as Article
      return { ...state, [article?.id]: article }

    case CLEAR_ARTICLES:
      return {}
  }
  return state
}

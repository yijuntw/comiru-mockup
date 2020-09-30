import axios from 'axios'
import qs, { StringifyOptions } from 'query-string'
import { delayInDev } from '@helpers'
import { Dispatch } from 'redux'

import { QS_OPTIONS } from '@constants'

export const UPDATE_ARTICLES = 'UPDATE_ARTICLES'
export const UPDATE_ARTICLE = 'UPDATE_ARTICLE'
export const CLEAR_ARTICLES = 'CLEAR_ARTICLES'

interface FetchArticlesParams {
  keywords: string[];
}

export function fetchArticles({ keywords }: FetchArticlesParams) {
  return async (dispatch: Dispatch, getState: () => any) => {
    try {
      const keywordsText = qs.stringify(keywords, QS_OPTIONS as StringifyOptions)

      if (getState().keywordArticlesMap[keywordsText]) {
        return
      }

      const { data: articles = [] } = await axios.get(`/api/articles`, { params: { keywords } })

      await delayInDev (2000)
      dispatch({ type: UPDATE_ARTICLES, payload: { [keywordsText]: articles } })
    } catch (e) {
      console.error(e)
    }
  }
}

export function clearArticles() {
  return { type: CLEAR_ARTICLES }
}

export function fetchArticle(id: string) {
  return async (dispatch: Dispatch) => {
    try {
      const { data: article } = await axios.get(`/api/article/${id}`)

      dispatch({ type: UPDATE_ARTICLE, payload: article })
    } catch (e) {
      console.error(e)
    }
  }
}

import { UPDATE_ARTICLES, CLEAR_ARTICLES } from '@actions/articles'

export interface Article {
  id: string;
  cover?: string;

  excerpt: string;
  timestamp: number;

  website: string; 
  url: string; 
  video?: string;
}

interface KeywordArticlesMap {
  [keywords: string]: Article[];
}

type UpdateArticlesAction = { type: string, payload: KeywordArticlesMap }
type ClearArticlesAction = { type: string, payload: void }

type Action = UpdateArticlesAction | ClearArticlesAction

const initialState: KeywordArticlesMap = {}

export default function articlesReducer(
  state: KeywordArticlesMap = initialState,
  { type, payload }: Action,
): KeywordArticlesMap {
  switch (type) {
    case UPDATE_ARTICLES:
      return { ...state, ...payload }

    case CLEAR_ARTICLES:
      return {}
  }
  return state
}

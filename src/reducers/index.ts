import { combineReducers, createStore, applyMiddleware, Store } from 'redux'
import thunkMiddleware from 'redux-thunk'

import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly'

// Model:
import me from './me'
import cities from './cities'
import articles from './articles'
import keywordArticlesMap from './keywordArticlesMap'

const store: Store = createStore (
  combineReducers({ me, cities, articles, keywordArticlesMap }),
  composeWithDevTools(applyMiddleware(thunkMiddleware)),
)

export default store

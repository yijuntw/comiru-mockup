import React, { memo } from 'react'

import { Provider } from 'react-redux'
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom'

import Layout from './Layout'

import Login from '@pages/Login'
import Search from '@pages/Search'
import Article from '@pages/Article'
import NotFound from '@pages/NotFound'

import store from '@reducers'

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Layout>
          <Switch>
            {/* Login Page */}
            <Route path="/login" component={Login} />

            {/* Pages */}
            <Route path="/search" component={Search} />
            <Route path="/article/:id" component={Article} />
            <Redirect exact from="/" to="/search" />

            {/* 404 */}
            <Route component={NotFound} />

          </Switch>
        </Layout>
      </BrowserRouter>
    </Provider>
  )
}

export default memo(App)

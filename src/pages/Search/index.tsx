import React, { memo, useState, useCallback } from 'react'

import AutoComplete from '@components/AutoComplete'
import Card from '@components/Card'
import Pagination from '@components/Pagination'

import useAsyncEffect from 'use-async-effect'
import { useAsyncDeepCompareEffect, delayInDev, classify } from '@helpers'
import { useDispatch, useSelector, shallowEqual } from 'react-redux'
import { Link, useHistory, useLocation } from 'react-router-dom'

import { is, path, split, join, remove, compose, map, slice } from 'ramda'
import qs, { ParseOptions, StringifyOptions } from 'query-string'
import format from 'date-fns/format'
import { highlight } from '@helpers'
import { Article as ArticleProps } from '@reducers/keywordArticlesMap'

import { fetchCities } from '@actions/cities'
import { fetchArticles, clearArticles } from '@actions/articles'

import { __DEV__, QS_OPTIONS } from '@constants'

import './index.styl'

const PAGE_SIZE = 15

const placeholder$ = <div className="placeholder">Loading…</div>

function Search() {
  const dispatch = useDispatch()
  const history = useHistory()
  const location = useLocation()

  // Search bar & its candidates:
  const [isLoadingCities, setIsLoadingCities] = useState(false)
  const cities = useSelector (path (['cities']), shallowEqual) as string[]

  const { keywords: rawKeywords = [], page: rawPage = 1 } = qs.parse(
    location.search,
    QS_OPTIONS as ParseOptions,
  )

  const keywords = (is (String) (rawKeywords) ? [rawKeywords] : rawKeywords) as string[]
  const keywordsText = qs.stringify (keywords, QS_OPTIONS as StringifyOptions)
  const page = (is (Number) (rawPage) ? rawPage : Number (rawPage)) as number

  const onReturnSearch = useCallback(
    (keywords: string[]) => history.push(
      `/search?${qs.stringify({ keywords, page: 1 }, QS_OPTIONS as StringifyOptions)}`
    ),
    [history],
  )

  useAsyncEffect(
    async (isMounted) => {
      setIsLoadingCities (true)
      await dispatch (fetchCities ())
      await delayInDev (2000)

      if (isMounted()) {
        setIsLoadingCities (false)
      }
    },
    [dispatch],
  )

  const input$ = (
      <header className="Search">
        <AutoComplete
          values={keywords}

          isLoadingCandidates={isLoadingCities}
          candidates={cities}
          candidatesOnly
          formatCandidate={compose (join(', '), split(','))}
          formatValue={compose (join (', '), remove(1, 1), split (','))}

          placeholder="Search news via cities’ names"
          onReturn={onReturnSearch}
        />
      </header>
  )

  // Results:
  const [isSearching, setIsSearching] = useState(false)
  const articles = (useSelector (path (['keywordArticlesMap', keywordsText]), shallowEqual) ?? []) as ArticleProps[]
  const articlesCount = articles.length

  const onChangePage = useCallback(
    (newPage: number) => {
      history.push(
        `/search?${qs.stringify({ keywords, page: newPage }, QS_OPTIONS as StringifyOptions)}`
      )

      window.scrollTo({ top: 0 })
    },
    [keywords],
  )

  useAsyncDeepCompareEffect(
    async (isMounted) => {
      if (keywords.length === 0 || articlesCount > 0) {
        setIsSearching (false)
        return
      }
      
      setIsSearching (true)

      await dispatch (fetchArticles ({ keywords }))
      await delayInDev (1000)

      if (isMounted()) {
        setIsSearching (false)
      }
    },

    // Dependencies:
    [dispatch, articlesCount, keywords],
  )

  const result$ = (
    // Loading and/or no results:
    keywords.length > 0 && (isSearching || articlesCount === 0)
    ? <section className={
        classify(
          'Placeholder',
          'Search',
          isSearching ? 'is-loading' : articlesCount === 0 ? 'has-no-result' : '',
        )
       }
      >
      { isSearching ? 'Loading results…' : 'No Result.' }
      </section>

    // Got results:
    : articlesCount > 0
    ? <>
        <main className="Search">
          <p className="result-desc">We have found you {articlesCount} results.</p>

          {
            compose (
              map ((a: ArticleProps) => (
                <Link key={a.id} className="result-item" to={`/article/${a.id}`}>
                  <Card className="Search" delay={__DEV__ ? 2000 : 400} placeholder={placeholder$}>
                    <header>{a.website}</header>
                    <p
                      dangerouslySetInnerHTML={{
                        __html: (
                          highlight
                          (compose (split(','), join (',')) (keywords))
                          (a.excerpt)
                        ),
                      }}
                    />
                    <time>{ format (a.timestamp, 'MMM dd, yyyy') }</time>
                    <img className="cover" loading="lazy" src={a.cover} alt="" />
                  </Card>
                </Link>
              )),
              slice ((Number(page) - 1) * PAGE_SIZE) (Number(page) * PAGE_SIZE),
            ) (articles)
          }
        </main>

        <Pagination
          total={articlesCount}
          current={page}
          pageSize={PAGE_SIZE}
          onChange={onChangePage}
        />
      </>

    : false
  )

  return (
    <>
      {input$}
      {result$}
    </>
  )
}

export default memo(Search)

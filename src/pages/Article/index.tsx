import React, { memo, useCallback, useEffect, useState } from 'react'
import { Article as ArticleProps } from '@reducers/keywordArticlesMap'

import { useDispatch, useSelector, shallowEqual } from 'react-redux'
import useAsyncEffect from 'use-async-effect'
import { useParams } from 'react-router-dom'
import { is, path } from 'ramda'
import format from 'date-fns/format'

import { fetchArticle } from '@actions/articles'

import Player from 'yt-player'

import './index.styl'

function Article() {
  const dispatch = useDispatch()

  const [player, setPlayer] = useState<Player>()
  const [isPlaying, setIsPlaying] = useState(false)

  const { id } = useParams<{ id: string }>()
  const article = useSelector (path (['articles', id]), shallowEqual) as ArticleProps

  const onTogglePlay = useCallback (
    () => {
      if (isPlaying) {
        player?.pause ()
      } else {
        player?.play ()
      }
    },
    [isPlaying, player],
  )

  const onKeyDown = useCallback (
    (event: KeyboardEvent) => {
      if (event.key === ' ') {
        event.preventDefault()

        if (player?.getState () === 'playing') {
          player?.pause ()
        } else if (player?.getState () === 'paused') {
          player?.play ()
        }
      }
    },
    [player],
  )

  useAsyncEffect (
    () => !article && dispatch (fetchArticle(id)),
    [article, dispatch],
  )

  useEffect (
    () => void setPlayer (new Player('.player', { autoplay: true })),
    [],
  )

  useAsyncEffect (
    async () => {
      player?.load (article?.video as string)

      player?.on ('playing', () => setIsPlaying(true))
      player?.on ('paused', () => setIsPlaying(false))

      player?.play ()

      if (player) {
        window.addEventListener('keydown', onKeyDown)
      }
    },

    () => player && window.removeEventListener('keydown', onKeyDown),

    [player, article],
  )

  return (
    <article className="News">
      <div className="player" />

      <div className="control">
        <button className={isPlaying ? 'pause' : 'play'} onClick={onTogglePlay}>Play/Pause</button>
        <p>Click the emoji button or press <kbd>Space</kbd> key to play or pause.</p>
      </div>

      { is (Object) (article) && (
        <>
          <header><a target="_blank" href={article.url}>{ article.website }</a></header>
          <p>{ article.excerpt }</p>
          <time>{ format (article.timestamp, 'MMMM dd, yyyy') }</time>
        </>
      )}
    </article>
  )
}

export default memo (Article)

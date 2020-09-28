import React, { memo, useCallback, useState, useEffect } from 'react'
import { useDispatch, useSelector, shallowEqual } from 'react-redux'
import { useHistory } from 'react-router-dom'

import { path } from 'ramda'
import { login } from '@actions/me'

import './index.styl'

function Login() {
  const dispatch = useDispatch()
  const history = useHistory()

  const loggedIn = Boolean (useSelector (path (['me', 'email']), shallowEqual))

  useEffect (
    () => void (loggedIn && history.replace('/search')),
    [loggedIn, history],
  )

  const [email, setEmail] = useState('ethantw@me.com')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const onChangeEmail = useCallback (
    ({ currentTarget: { value } }: React.SyntheticEvent<HTMLInputElement>) => (
      setEmail(value)
    ),
    [],
  )

  const onSubmit = useCallback (
    async (event: React.SyntheticEvent) => { 
      event.preventDefault()
      setIsSubmitting (true)
      await dispatch (login ({ email, password: '1234' }))
      setIsSubmitting (false)
    },
    [email, dispatch],
  )

  return (
    <form lang="ja" className="Login" onSubmit={onSubmit}>
      <h1>生徒・保護者ログイン（スクールポパー）</h1>
      <p>生徒番号とパスワードを入力してログインしてください。生徒番号やパスワードがわからない場合は、教室にお問い合わせください。</p>

      <label>
        <span>生徒番号</span>
        <input type="email" value={email} onChange={onChangeEmail} />
      </label>

      <label>
        <span>パスワード</span>
        <input type="password" />
      </label>

      <label className="remember-me">
        <input type="checkbox" />
        <span>パスワードを表示</span>
      </label>

      <button type="submit" disabled={isSubmitting || !email}>
        { isSubmitting ? 'ちょっと待って…' : 'ログインする' }
      </button>
    </form>
  )
}

export default memo (Login)

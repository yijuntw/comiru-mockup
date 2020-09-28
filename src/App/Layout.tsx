import React, { memo, useCallback } from 'react'
import { Link } from 'react-router-dom'
import BackToTop from '@components/BackToTop'

import { useDispatch, useSelector, shallowEqual } from 'react-redux'
import { path } from 'ramda'
import { logout } from '@actions/me'
import { Me as MeInterface } from '@reducers/me'

import logo from '@assets/logo.png'

import './Layout.styl'

export interface LayoutInterface {
  children?: React.ReactNode;
}

function Layout({ children }: LayoutInterface) {
  const dispatch = useDispatch ()

  const me = useSelector (path (['me']), shallowEqual) as MeInterface
  const loggedIn = Boolean (me.email)
  const myName = me.name

  const onLogout = useCallback (
    () => dispatch (logout ()),
    [dispatch],
  )

  return (
    <>
      <nav className="Layout">
        <Link to="/">
          <img className="logo" src={logo} alt="Comiru logo" />
        </Link>
      </nav>

      { children }
      <footer className="Layout">
        {
          loggedIn 
          ? <>
              Hello, {myName}.
              {' '}
              <button className="logout" onClick={onLogout}>Logout</button>
            </>
          : <Link className="login" to="/login">Login</Link>
        }
        <BackToTop />
      </footer>
    </>
  )
}

export default memo(Layout)

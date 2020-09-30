import React from 'react'
import ReactDOM from 'react-dom'

export function renderAppRootlessly(app: React.ReactNode) {
  return new Promise(resolve => (
    ReactDOM.render(
      ReactDOM.createPortal(app, document.body),
      document.createDocumentFragment(),
      resolve,
    )
  ))
}

import React from 'react'
import App from './App'

import { waitForDOMReady, delayInDev, renderAppRootlessly } from '@helpers'

void (async function main() {
  await waitForDOMReady ()
  await delayInDev (3000)
  await renderAppRootlessly (<App />)
  document.body.classList.add('is-loaded')
}) ()

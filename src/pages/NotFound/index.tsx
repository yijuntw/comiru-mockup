import React, { memo } from 'react'

import './index.styl'

function NotFound() {
  return (
    <div className="NotFound">
      <h1>404 Not Found</h1>
      <p>Sorry! We cannot find what you are looking for.</p>
    </div>
  )
}

export default memo(NotFound)

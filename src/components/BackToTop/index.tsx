import React, { memo, useCallback, useState } from 'react'
import useAsyncEffect from 'use-async-effect'

import { classify } from '@helpers';

import './index.styl'

export interface BackToTopProps {
  className?: string;
  target?: Window | HTMLElement;
}

function BackToTop({
  className,
  target = window,
}: BackToTopProps) {
  const onClick = useCallback(
    () => target.scrollTo({
      top: 0,
      behavior: 'smooth',
    }),
    [target],
  )

  const [disabled, setDisabled] = useState(true)

  const onScroll = useCallback(
    () => {
      const y = target === window ? target.scrollY : (target as HTMLElement)?.scrollTop
      setDisabled(y === 0)
    },
    [target],
  )

  useAsyncEffect(
    () => target?.addEventListener('scroll', onScroll),
    () => target?.removeEventListener('scroll', onScroll),
    [target, onScroll],
  )

  return (
    <button className={classify('BackToTop', className)} disabled={disabled} onClick={onClick}>
      Back to Top
    </button>
  )
}

export default memo (BackToTop)

import React, { memo, useCallback, useEffect } from 'react'
import { compose, divide, max, min, F } from 'ramda'
import { classify } from '@helpers'

import './index.styl'

export interface PaginationProps {
  className?: string;
  disabled?: boolean;

  current?: number;
  total?: number;
  pageSize?: number;

  onChange?: (n: number) => any | Promise<any>;
}

function Pagination({
  className,
  disabled,

  current = 1,
  total = 0,
  pageSize = 30,

  onChange = F,
}: PaginationProps) {
  const pagesCount = compose (max (1), Math.ceil, divide (total)) (pageSize)

  const backwardDisabled = disabled || current === 1
  const forwardDisabled = disabled || current === pagesCount

  const goBackward = useCallback(
    () => onChange(max (1) (current - 1)),
    [current, onChange],
  )

  const goForward = useCallback(
    () => onChange(min (pagesCount) (current + 1)),
    [current, pagesCount, onChange],
  )

  useEffect(
    () => void (current > pagesCount && onChange(pagesCount)),
    [current, pagesCount],
  )

  return (
    <nav className={classify('Pagination', className, disabled && 'is-disabled')}>
      <span className="current">{current}</span>
      <span className="out-of">/</span>
      <span className="pages-count">{pagesCount}</span>

      <button className="backward" disabled={backwardDisabled} onClick={goBackward}>Backward</button>
      <button className="forward" disabled={forwardDisabled} onClick={goForward}>Forward</button>
    </nav>
  )
}

export default memo (Pagination)

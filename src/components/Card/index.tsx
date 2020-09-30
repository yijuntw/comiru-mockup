import React, { memo, } from 'react'

import { classify, useBeenScrolled } from '@helpers'

import './index.styl'

export interface CardProps {
  className?: string;
  delay?: number;

  placeholder?: React.ReactNode;
  children?: React.ReactNode;
}

function Card({
  className,
  delay: delayMs,

  placeholder,
  children,
}: CardProps) {
  const [ref, beenScrolled] = useBeenScrolled ({ delay: delayMs })
  const isVisiblePlaceholder = Boolean (!beenScrolled && placeholder)

  return (
    <article ref={ref} className={classify ('Card', className, isVisiblePlaceholder && 'is-placeholder')}>
    { isVisiblePlaceholder ? placeholder : children }
    </article>
  )
}

export default memo(Card)

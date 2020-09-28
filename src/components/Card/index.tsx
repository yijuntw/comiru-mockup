import React, { memo, useEffect, useState } from 'react'

import { useInView } from 'react-intersection-observer'
import { classify } from '@helpers'

import './index.styl'

export interface CardProps {
  className?: string;
  delay?: number;

  placeholder?: React.ReactNode;
  children?: React.ReactNode;
}

function Card({
  className,
  delay,

  placeholder,
  children,
}: CardProps) {
  const [ref, inView] = useInView({ threshold: 0, delay })
  const [BeenScrolled, setBeenScrolled] = useState(inView)

  const isVisiblePlaceholder = Boolean (!BeenScrolled && placeholder)

  useEffect(
    () => void (inView && setBeenScrolled(true)),
    [inView],
  )

  return (
    <article ref={ref} className={classify('Card', className, isVisiblePlaceholder && 'is-placeholder')}>
    { isVisiblePlaceholder ? placeholder : children }
    </article>
  )
}

export default memo(Card)

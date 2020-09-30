import React, { useRef } from 'react'

import { is, F } from 'ramda'
import { notEquals } from '../misc'

import useAsyncEffect from 'use-async-effect'

export function useDeepCompareMemoize (value: any) {
  const ref = useRef()

  if (notEquals (value) (ref.current)) {
    ref.current = value
  }

  return ref.current
}

export function useAsyncDeepCompareEffect (
  fn: (isMounted: () => boolean) => any | Promise<any>,
  a1: any[] | (() => any | Promise<any>) = [],
  a2: any[] = [],
) {
  const onDestory = (is (Function) (a1) ? a1 : F) as () => any | Promise<any>
  const dependencies = (is (Array) (a1) ? a1 : a2) as any[]

  return useAsyncEffect (
    fn,
    onDestory,
    useDeepCompareMemoize (dependencies),
  )
}

import { useCallback, useState } from 'react'
import { useAsyncDeepCompareEffect } from './effects'

import { delay } from '../time'
import { isnt } from '../misc'

interface Options extends IntersectionObserverInit {
  delay?: number;
}

type Result = [
  (ref: HTMLElement) => void,
  boolean,
]

export function useBeenScrolled (options: Options = {}): Result {
  const { root = window } = options

  const [beenScrolled, setBeenScrolled] = useState (false)
  const [observer, setObserber] = useState <IntersectionObserver> ()

  useAsyncDeepCompareEffect (
    (isMounted) => {
      if (isnt (Function) (IntersectionObserver)) {
        return
      }

      const observer = new IntersectionObserver(
        ([entry]) => isMounted() && entry.isIntersecting && setBeenScrolled (true),
        options,
      )

      setObserber (observer)
    },
    () => observer?.disconnect (),
    [options],
  )

  const setRef = useCallback (
    (ref: HTMLElement) => {
      if (!ref) {
        return
      }

      if (observer) {
        observer.observe (ref)
        return
      }

      // In case current browser does not support `IntersectionObserver`,
      // fall back to using `target.fn.getBoundingClientRect`, etc.
      if (isnt (Function) (IntersectionObserver)) {
        const onBeenScrolled = async () => {
          if (beenScrolled) {
            return
          }

          const rootElement = (root instanceof Window ? root.document.documentElement : root) ?? document.documentElement
          const rootHeight = root instanceof Window ? root.innerHeight : rootElement.clientHeight
          const { bottom, top } = ref.getBoundingClientRect()

          const isScrolled = top <= rootHeight && bottom >= 0

          if (isScrolled) {
            await delay (options.delay)
            setBeenScrolled (true)

            // Cancel event listener once the element is scrolled:
            root?.removeEventListener ('scroll', onBeenScrolled)
            root?.removeEventListener ('resize', onBeenScrolled)
          }
        }

        onBeenScrolled ()
        root?.addEventListener ('scroll', onBeenScrolled)
        root?.addEventListener ('resize', onBeenScrolled)
      }
    },
    [observer, root, beenScrolled],
  )

  return [setRef, beenScrolled]
}

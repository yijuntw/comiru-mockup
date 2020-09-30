import { compose, curry, equals, filter, is, join, not } from 'ramda'

const trimList = compose (
  join (' '),
  filter (Boolean),
)

export const isnt = curry (compose (not, is))
export const notEquals = curry (compose (not, equals))

export const classify = (...args: (string | boolean | undefined | null)[]) => trimList (args)

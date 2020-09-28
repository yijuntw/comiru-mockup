import { compose, curry, not, equals, join, filter } from 'ramda'

const trimList = compose (
  join (' '),
  filter (Boolean),
)

export const notEquals = curry (compose (not, equals))

export const classify = (...args: (string | boolean | undefined | null)[]) => trimList (args)

import { compose, replace, test, join, identity } from 'ramda'
import { sanitize } from 'dompurify'

export const highlight = (qs: string[]) => compose (
  sanitize,
  qs.length > 0
    ? replace (new RegExp (`(${join ('|') (qs)})`, 'gi')) ('<b>$1</b>')
    : identity,
)

export const escape = replace (/[.*+?^${}()|[\]\\]/g) ('\\$&')
export const matchQs = (v: string) => test (new RegExp (`\\b${escape (v)}`, 'gi'))

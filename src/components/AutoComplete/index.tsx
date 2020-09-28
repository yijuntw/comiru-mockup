import React, { memo, useCallback, useMemo, useEffect, useState, useRef } from 'react'

import useDeepCompareEffect from 'use-deep-compare-effect'
import { F, map, take, compose, dropLast, without, identity, filter, split } from 'ramda'
import { classify, delay, highlight, matchQs } from '@helpers'

import './index.styl'

export interface AutoCompleteProps {
  values?: string[];
  placeholder?: string;

  candidates?: string[];
  isLoadingCandidates?: boolean;
  candidatesOnly?: boolean;
  maxValueCount?: number;

  formatCandidate?: (c: string) => React.ReactText;
  formatValue?: (v: string) => React.ReactText;

  onType?: (v: string) => void | any;
  onReturn?: (v: string[]) => void | any;
}

function AutoComplete({
  values: propValues = [],
  placeholder,

  maxValueCount = 8,
  isLoadingCandidates = false,
  candidates = [],
  candidatesOnly = false,

  formatCandidate = identity,
  formatValue = identity,

  onType = F,
  onReturn = F,
}: AutoCompleteProps) {
  const [typingValue, setTypingValue] = useState('')

  const [values, setValues] = useState<string[]>(propValues)
  const [hoverCandidate, setHoveredCandidate] = useState('')

  const excerptedCandidates = useMemo(
    () => compose(
      take (100),
      filter ((c: string) => (
        typingValue
        ? matchQs (typingValue) (c)
        : true
      )),
      without (values),
    ) (candidates),
    [typingValue, values, candidates],
  )

  const onChange = useCallback(
    ({ currentTarget: { value } }: React.ChangeEvent<HTMLInputElement>) => {
      setTypingValue(value)
      onType(value)
    },
    [onType],
  )

  const inputRef = useRef<HTMLInputElement>(null)

  const [isFocused, setIsFocused] = useState(false)

  const onFocus = useCallback(
    async () => {
      setIsFocused(true)

      const $ref = inputRef.current
      $ref?.focus?.()
    },
    [inputRef],
  )

  const onBlur = useCallback(
    async () => {
      await delay(200)
      setIsFocused(false)
    },
    [],
  )

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      const { key } = event

      const hoverCandidateIndex = excerptedCandidates.findIndex((c: string) => c === hoverCandidate)

      if (!isFocused) {
        onFocus()
      }

      if (key === 'Escape') {
        setTypingValue('')

      } else if (key === 'Backspace' && !typingValue) {
        const newValues = dropLast (1) (values) as string[]
        event.preventDefault()

        setValues(newValues)
        onReturn(newValues)

      } else if (key === 'Enter') {
        event.preventDefault()

        const newValue = candidatesOnly ? hoverCandidate : typingValue
        const newValues = Array.from (new Set ([...values, newValue]))

        if (newValue) {
          setTypingValue('')
          setValues(newValues)
          onReturn(newValues)
        }
      } else if (key === 'ArrowUp' || key === 'ArrowDown') {
        event.preventDefault()

        const newValue = excerptedCandidates[hoverCandidateIndex + (key === 'ArrowUp' ? -1 : 1)]

        if (newValue) {
          setHoveredCandidate(newValue)
        }
      }
    },
    [
      isFocused,
      values, typingValue,
      candidatesOnly, hoverCandidate, excerptedCandidates,
      onFocus, onBlur, onReturn,
    ],
  )

  const onHoverCandidate = useCallback(
    ({ currentTarget: { dataset: { candidate } } }: React.MouseEvent<HTMLElement>) => (
      setHoveredCandidate(candidate as string)
    ),
    [],
  )

  const onClickCandidate = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      event.stopPropagation()

      const { currentTarget: { dataset: { candidate } } } = event
      const newValues = [...values, candidate as string]

      setTypingValue('')
      setValues(newValues)
      onReturn(newValues)

      onBlur()
    },
    [values, onBlur, onReturn],
  )

  const onRemoveValue = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      event.stopPropagation()

      const { currentTarget: { dataset: { value } } } = event
      const newValues = without ([value as string]) (values)
      onReturn(newValues)
    },
    [values, onReturn],
  )

  const onClear = useCallback(
    (event) => {
      event.stopPropagation()

      setTypingValue('')
      setValues([])
      onReturn([])
    },
    [onReturn],
  )

  const onSubmit = useCallback(
    (event) => {
      event.stopPropagation()
      onReturn(values)
    },
    [values, onReturn],
  )

  useDeepCompareEffect(
    () => void setValues(propValues),
    [propValues],
  )

  useEffect(
    () => void setHoveredCandidate(excerptedCandidates[0]),
    [excerptedCandidates[0]],
  )

  return (
    <label
      className={classify(
        'AutoComplete',
        isLoadingCandidates && 'is-loading-candidates',
        isFocused ? 'is-focused' : 'isnt-focused',
        values.length > 0 ? 'has-values' : 'has-no-value',
        values.length >= maxValueCount && 'has-reached-limit',
      )}
    >
      <input
        ref={inputRef}

        value={typingValue}
        placeholder={placeholder}
        disabled={values.length >= maxValueCount}

        onChange={onChange}
        onKeyDown={onKeyDown}

        onFocus={onFocus}
        onBlur={onBlur}
      /> 

      {
        map ((value: string) => (
          <span key={value} className="value">
            <span>{ formatValue(value) }</span>
            <button
              type="button"
              className="remove"
              data-value={value}
              onClick={onRemoveValue}
            >
              Remove
            </button>
          </span>
        )) (values)
      }

      <button type="button" className="clear" disabled={values.length === 0 && !typingValue} onClick={onClear}>Clear</button>
      <button type="button" className="submit" disabled={values.length === 0} onClick={onSubmit}>Search</button>

      <ul className="candidates">
      {
       isLoadingCandidates
        ? <li className="placeholder is-loading">Loading…</li>

        : candidatesOnly && excerptedCandidates.length === 0
        ? <li className="placeholder has-no-result">No Such Candidates.</li>

        : map((candidate: string) => (
          <li
            key={candidate}
            className={classify (candidate === hoverCandidate && 'is-hovered')}
              data-candidate={candidate}
              onMouseOver={onHoverCandidate}
              onClick={onClickCandidate}

              dangerouslySetInnerHTML={{
                __html:
                  compose (
                    typingValue ? highlight (split (' ') (typingValue)) : identity,
                    formatCandidate,
                  ) (candidate)
              }}
            />
          ))
          (excerptedCandidates)
      }
      </ul>
    </label>
  )
}

export default memo(AutoComplete)

import axios from 'axios'
import { Dispatch } from 'redux'

import { compose, replace, split, tail } from 'ramda'
import qs from 'query-string'
import { delayInDev } from '@helpers'

export const UPDATE_CITIES = 'UPDATE_CITIES'

const parseRawCities = compose (tail, split (/\n/), replace (/\r/g, ''))

export function fetchCities(keyword: string = '') {
  return async (dispatch: Dispatch) => {
    try {
      const { data: rawCities } = await axios.get(`/api/cities?${qs.stringify({ keyword })}`)
      const cities = parseRawCities (rawCities)

      await delayInDev (2000)

      dispatch({ type: UPDATE_CITIES, payload: cities })
    } catch (e) {
      console.error(e)
    }
  }}

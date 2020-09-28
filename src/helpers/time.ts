import { F } from 'ramda'
import { __DEV__ } from '@constants'

export const delay = (ms: number = 0) => new Promise(resolve => setTimeout(resolve, ms))
export const delayInDev = (ms: number = 0) => __DEV__ && new Promise(resolve => setTimeout(resolve, ms))

import { promises as fs } from 'fs'
import path from 'path'

import ramda from 'ramda'

import { __CWD__ } from '../../constants.js'

const { map } = ramda

export const rand = () => Math.random ()
export const shuffle = xs => xs[Math.floor(rand() * xs.length)]
export const randTime = () => new Date() - Math.floor(rand() * 100000000000)

export const readFile = n => fs.readFile(path.resolve(__CWD__, n), 'utf8')
export const readFiles = ns => Promise.all ( map (readFile) (ns) )

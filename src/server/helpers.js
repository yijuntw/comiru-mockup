import { promises as fs } from 'fs'
import path from 'path'

import ramda from 'ramda'

import { __CWD__ } from '../../constants.js'

const { map } = ramda

export const shuffle = xs => xs[Math.floor(Math.random() * xs.length)]
export const randTime = () => new Date() - Math.floor(Math.random() * 100000000000)

export const readFile = n => fs.readFile(path.resolve(__CWD__, n), 'utf8')
export const readFiles = ns => Promise.all ( map (readFile) (ns) )

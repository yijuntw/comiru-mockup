import path from 'path'

export const __CWD__ = process.cwd()
export const __DEV__ = process.env.NODE_ENV === 'development'
export const __PROD__ = process.env.NODE_ENV === 'production'

export const DIST_PATH = path.resolve(__CWD__, 'dist')

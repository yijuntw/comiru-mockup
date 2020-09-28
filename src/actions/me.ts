// import axios from 'axios'
import { Dispatch } from 'redux'
import { delay } from '@helpers'

export const UPDATE_ME = 'UPDATE_ME'

interface Login {
  email: string;
  password: string;
}

export function login({ email, password }: Login) {
  return async (dispatch: Dispatch) => {
    try {
      // const { data: me } = await axios.post(`/api/login`, { email, password })
      await delay(1000)
      dispatch({ type: UPDATE_ME, payload: { name: 'Yijun', email } })
    } catch (e) {
      console.error(e)
    }
  }
}

export function logout() {
  return async (dispatch: Dispatch) => {
    try {
      // await axios.post(`/api/logout`)
      await delay(400)
      dispatch({ type: UPDATE_ME, payload: { name: '', email: '' } })
    } catch (e) {
      console.error(e)
    }
  }
}

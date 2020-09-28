import { UPDATE_ME } from '@actions/me'

export interface Me {
  name: string;
  email: string;
}

interface UpdateMeAction {
  type: string;
  payload: Me;
}

const initialState: Me = {
  name: '',
  email: '',
}

export default function meReducer(state: Me = initialState, { type, payload }: UpdateMeAction): Me {
  switch (type) {
    case 'UPDATE_ME':
      return { ...state, ...payload }
  }
  return state
}

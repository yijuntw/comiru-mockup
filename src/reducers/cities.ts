import { UPDATE_CITIES } from '@actions/cities'

type City = string
type Cities = City[]
interface UpdateCitiesAction { type: string, payload: Cities }

const initialState: Cities = []

export default function citiesReducer(
  state: Cities = initialState,
  { type, payload }: UpdateCitiesAction,
): Cities {
  switch (type) {
    case UPDATE_CITIES:
      return payload
  }
  return state
}

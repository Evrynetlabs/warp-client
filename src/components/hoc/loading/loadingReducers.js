import actionTypes from 'Components/hoc/loading/loadingActionTypes'

export const initState = () => ({
  isLoading: false,
})

const initialState = initState()

export default function loadingReducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.START_LOADING:
      return {
        ...state,
        isLoading: true,
      }
    case actionTypes.STOP_LOADING:
      return {
        ...state,
        isLoading: false,
      }
    default:
      return state
  }
}

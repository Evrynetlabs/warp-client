import actionTypes from 'Components/hoc/loading/loadingActionTypes'

export const loadingReducer = (state = {}, action) => {
  switch (action.type) {
    case actionTypes.START_LOADING:
      return {
        ...state,
        [action.id]: {
          isLoading: true,
        },
      }

    case actionTypes.STOP_LOADING:
      return {
        ...state,
        [action.id]: {
          isLoading: false,
        },
      }

    default:
      return state
  }
}

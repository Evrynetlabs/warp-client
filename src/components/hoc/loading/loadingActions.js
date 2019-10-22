import actionTypes from 'Components/hoc/loading/loadingActionTypes'

export const startLoading = (id) => {
  return {
    type: actionTypes.START_LOADING,
    id,
  }
}

export const stopLoading = (id) => {
  return {
    type: actionTypes.STOP_LOADING,
    id,
  }
}

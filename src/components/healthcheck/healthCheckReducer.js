import actionTypes from 'Components/healthcheck/healthCheckActionTypes'

export const initState = () => {
  return {
    [actionTypes.ASYNC_HEALTH_CHECK.stateKey]: null,
    [actionTypes.ASYNC_HEALTH_CHECK.loadingKey]: true,
    [actionTypes.ASYNC_HEALTH_CHECK.errorKey]: null,
  }
}

const initialState = initState()

export default function(state = initialState, action) {
  switch (action.type) {
    case actionTypes.ASYNC_HEALTH_CHECK.SUCCESS: {
      return {
        ...state,
        [actionTypes.ASYNC_HEALTH_CHECK.stateKey]: action.payload,
        [actionTypes.ASYNC_HEALTH_CHECK.loadingKey]: false,
        [actionTypes.ASYNC_HEALTH_CHECK.errorKey]: null,
      }
    }
    case actionTypes.ASYNC_HEALTH_CHECK.PENDING: {
      return {
        ...state,
        [actionTypes.ASYNC_HEALTH_CHECK.loadingKey]: action.payload,
        [actionTypes.ASYNC_HEALTH_CHECK.errorKey]: null,
      }
    }
    case actionTypes.ASYNC_HEALTH_CHECK.FAILURE: {
      return {
        ...state,
        [actionTypes.ASYNC_HEALTH_CHECK.stateKey]: null,
        [actionTypes.ASYNC_HEALTH_CHECK.loadingKey]: false,
        [actionTypes.ASYNC_HEALTH_CHECK.errorKey]: action.payload,
      }
    }
    default:
      return state
  }
}

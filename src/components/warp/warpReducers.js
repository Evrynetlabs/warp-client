import actionTypes from 'Components/warp/warpActionTypes'

const initState = () => {
  return {
    [actionTypes.ASYNC_COLLECT_HASHES.stateKey]: null,
    [actionTypes.ASYNC_COLLECT_HASHES.loadingKey]: false,
    [actionTypes.ASYNC_COLLECT_HASHES.errorKey]: null,
    [actionTypes.ASYNC_GET_WHITELISTED_ASSETS.stateKey]: [],
    [actionTypes.ASYNC_GET_WHITELISTED_ASSETS.loadingKey]: false,
    [actionTypes.ASYNC_GET_WHITELISTED_ASSETS.errorKey]: null,
  }
}

const initialState = initState()

export default function(state = initialState, action) {
  switch (action.type) {
    case actionTypes.ASYNC_COLLECT_HASHES.SUCCESS: {
      const { stellarTxHash, evrynetTxHash } = action.payload
      return {
        ...state,
        [actionTypes.ASYNC_COLLECT_HASHES.stateKey]: {
          stellar: stellarTxHash,
          evry: evrynetTxHash,
        },
        [actionTypes.ASYNC_COLLECT_HASHES.loadingKey]: false,
        [actionTypes.ASYNC_COLLECT_HASHES.errorKey]: null,
      }
    }
    case actionTypes.ASYNC_COLLECT_HASHES.PENDING: {
      return {
        ...state,
        [actionTypes.ASYNC_COLLECT_HASHES.stateKey]: null,
        [actionTypes.ASYNC_COLLECT_HASHES.loadingKey]: action.payload,
        [actionTypes.ASYNC_COLLECT_HASHES.errorKey]: null,
      }
    }
    case actionTypes.ASYNC_COLLECT_HASHES.FAILURE: {
      return {
        ...state,
        [actionTypes.ASYNC_COLLECT_HASHES.stateKey]: null,
        [actionTypes.ASYNC_COLLECT_HASHES.loadingKey]: false,
        [actionTypes.ASYNC_COLLECT_HASHES.errorKey]: action.payload,
      }
    }
    case actionTypes.ASYNC_GET_WHITELISTED_ASSETS.SUCCESS: {
      return {
        ...state,
        [actionTypes.ASYNC_GET_WHITELISTED_ASSETS.stateKey]: action.payload,
        [actionTypes.ASYNC_GET_WHITELISTED_ASSETS.loadingKey]: false,
        [actionTypes.ASYNC_GET_WHITELISTED_ASSETS.errorKey]: null,
      }
    }
    case actionTypes.ASYNC_GET_WHITELISTED_ASSETS.PENDING: {
      return {
        ...state,
        [actionTypes.ASYNC_GET_WHITELISTED_ASSETS.stateKey]: [],
        [actionTypes.ASYNC_GET_WHITELISTED_ASSETS.loadingKey]: action.payload,
        [actionTypes.ASYNC_GET_WHITELISTED_ASSETS.errorKey]: null,
      }
    }
    case actionTypes.ASYNC_GET_WHITELISTED_ASSETS.FAILURE: {
      return {
        ...state,
        [actionTypes.ASYNC_GET_WHITELISTED_ASSETS.stateKey]: [],
        [actionTypes.ASYNC_GET_WHITELISTED_ASSETS.loadingKey]: false,
        [actionTypes.ASYNC_GET_WHITELISTED_ASSETS.errorKey]: action.payload,
      }
    }
    default:
      return state
  }
}

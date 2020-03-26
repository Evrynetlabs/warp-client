import actionTypes from 'Components/warp/warpActionTypes'

export const initState = () => {
  return {
    [actionTypes.ASYNC_COLLECT_HASHES.stateKey]: null,
    [actionTypes.ASYNC_COLLECT_HASHES.loadingKey]: true,
    [actionTypes.ASYNC_COLLECT_HASHES.errorKey]: null,
    [actionTypes.ASYNC_GET_WHITELISTED_ASSETS.stateKey]: [],
    [actionTypes.ASYNC_GET_WHITELISTED_ASSETS.loadingKey]: true,
    [actionTypes.ASYNC_GET_WHITELISTED_ASSETS.errorKey]: null,
    [actionTypes.ASYNC_TOGGLE_WARP_SWITCH.stateKey]: true,
    [actionTypes.ASYNC_GET_ACCOUNT_BALANCE.stateKey]: null,
    [actionTypes.ASYNC_GET_ACCOUNT_BALANCE.loadingKey]: true,
    [actionTypes.ASYNC_GET_ACCOUNT_BALANCE.errorKey]: null,
    [actionTypes.ASYNC_GET_TRUSTLINES.stateKey]: [],
    [actionTypes.ASYNC_GET_TRUSTLINES.loadingKey]: true,
    [actionTypes.ASYNC_GET_TRUSTLINES.errorKey]: null,
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
          evrynet: evrynetTxHash,
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
    case actionTypes.ASYNC_TOGGLE_WARP_SWITCH.SUCCESS: {
      return {
        ...state,
        [actionTypes.ASYNC_TOGGLE_WARP_SWITCH.stateKey]: action.payload,
      }
    }
    case actionTypes.ASYNC_GET_ACCOUNT_BALANCE.PENDING: {
      return {
        ...state,
        [actionTypes.ASYNC_GET_ACCOUNT_BALANCE.stateKey]: null,
        [actionTypes.ASYNC_GET_ACCOUNT_BALANCE.loadingKey]: action.payload,
        [actionTypes.ASYNC_GET_ACCOUNT_BALANCE.errorKey]: null,
      }
    }
    case actionTypes.ASYNC_GET_ACCOUNT_BALANCE.FAILURE: {
      return {
        ...state,
        [actionTypes.ASYNC_GET_ACCOUNT_BALANCE.stateKey]: null,
        [actionTypes.ASYNC_GET_ACCOUNT_BALANCE.loadingKey]: false,
        [actionTypes.ASYNC_GET_ACCOUNT_BALANCE.errorKey]: action.payload,
      }
    }
    case actionTypes.ASYNC_GET_ACCOUNT_BALANCE.SUCCESS: {
      return {
        ...state,
        [actionTypes.ASYNC_GET_ACCOUNT_BALANCE.loadingKey]: false,
        [actionTypes.ASYNC_GET_ACCOUNT_BALANCE.errorKey]: null,
        [actionTypes.ASYNC_GET_ACCOUNT_BALANCE.stateKey]: action.payload,
      }
    }
    case actionTypes.ASYNC_GET_TRUSTLINES.PENDING: {
      return {
        ...state,
        [actionTypes.ASYNC_GET_TRUSTLINES.stateKey]: [],
        [actionTypes.ASYNC_GET_TRUSTLINES.loadingKey]: action.payload,
        [actionTypes.ASYNC_GET_TRUSTLINES.errorKey]: null,
      }
    }
    case actionTypes.ASYNC_GET_TRUSTLINES.FAILURE: {
      return {
        ...state,
        [actionTypes.ASYNC_GET_TRUSTLINES.stateKey]: [],
        [actionTypes.ASYNC_GET_TRUSTLINES.loadingKey]: false,
        [actionTypes.ASYNC_GET_TRUSTLINES.errorKey]: action.payload,
      }
    }
    case actionTypes.ASYNC_GET_TRUSTLINES.SUCCESS: {
      return {
        ...state,
        [actionTypes.ASYNC_GET_TRUSTLINES.loadingKey]: false,
        [actionTypes.ASYNC_GET_TRUSTLINES.errorKey]: null,
        [actionTypes.ASYNC_GET_TRUSTLINES.stateKey]: action.payload,
      }
    }
    default:
      return state
  }
}

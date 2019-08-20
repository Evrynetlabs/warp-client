import {
  COLLECT_HASHES_SUCESS,
  COLLECT_HASHES_PENDING,
  COLLECT_HASHES_ERROR,
} from 'Components/warp/warpActionTypes'

const initState = () => {
  return {
    collectTxHashesData: null,
    collectTxHashesPending: false,
    collectTxHashesError: null,
  }
}

const initialState = initState()
console.log(initialState)

export default function(state = initialState, action) {
  switch (action.type) {
    case COLLECT_HASHES_SUCESS: {
      return {
        ...state,
        collectTxHashesData: {
          stellar: action.payload.stellarTxHash,
          evry: action.payload.evrynetTxHash,
        },
        collectTxHashesPending: false,
        collectTxHashesError: null,
      }
    }
    case COLLECT_HASHES_PENDING: {
      return {
        ...state,
        collectTxHashesData: null,
        collectTxHashesPending: action.payload,
        collectTxHashesError: null,
      }
    }
    case COLLECT_HASHES_ERROR: {
      return {
        ...state,
        collectTxHashesData: null,
        collectTxHashesPending: false,
        collectTxHashesError: action.payload,
      }
    }
    default:
      return state
  }
}

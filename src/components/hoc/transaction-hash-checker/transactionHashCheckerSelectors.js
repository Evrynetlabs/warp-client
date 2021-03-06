import { createStructuredSelector } from 'reselect'
import actionTypes from 'Components/warp/warpActionTypes'

export const selectCollectedTxHashes = createStructuredSelector({
  state: (state) => {
    return state.warp[actionTypes.ASYNC_COLLECT_HASHES.stateKey]
  },
  loading: (state) => {
    return state.warp[actionTypes.ASYNC_COLLECT_HASHES.loadingKey]
  },
  error: (state) => {
    return state.warp[actionTypes.ASYNC_COLLECT_HASHES.errorKey]
  },
})

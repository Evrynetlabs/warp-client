import { createStructuredSelector } from 'reselect'
import actionTypes from 'Components/warp/warpActionTypes'

export const isToEvrySelector = (state) =>
  state.warp[actionTypes.ASYNC_TOGGLE_WARP_SWITCH.stateKey]

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

export const selectWhitelistedAssets = createStructuredSelector({
  state: (state) => {
    return state.warp[actionTypes.ASYNC_GET_WHITELISTED_ASSETS.stateKey]
  },
  loading: (state) => {
    return state.warp[actionTypes.ASYNC_GET_WHITELISTED_ASSETS.loadingKey]
  },
  error: (state) => {
    return state.warp[actionTypes.ASYNC_GET_WHITELISTED_ASSETS.errorKey]
  },
})

export const selectAccountBalance = createStructuredSelector({
  state: (state) => {
    return state.warp[actionTypes.ASYNC_GET_ACCOUNT_BALANCE.stateKey]
  },
  loading: (state) => {
    return state.warp[actionTypes.ASYNC_GET_ACCOUNT_BALANCE.loadingKey]
  },
  error: (state) => {
    return state.warp[actionTypes.ASYNC_GET_ACCOUNT_BALANCE.errorKey]
  },
})

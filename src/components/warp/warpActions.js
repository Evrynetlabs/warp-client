import actionTypes from 'Components/warp/warpActionTypes'
import { getWarpInstance } from '@/utils/singleton'
import store from '@/store'

export const collectTxHashesSuccess = ({ stellarTxHash, evrynetTxHash }) => ({
  type: actionTypes.ASYNC_COLLECT_HASHES.SUCCESS,
  payload: { stellarTxHash, evrynetTxHash },
})

export const collectTxHashesPending = (pendingStatus) => ({
  type: actionTypes.ASYNC_COLLECT_HASHES.PENDING,
  payload: pendingStatus,
})

export const collectTxHashesError = (error) => ({
  type: actionTypes.ASYNC_COLLECT_HASHES.FAILURE,
  payload: error,
})

export const toEvrynet = ({ src, dest, amount, asset }) => {
  const warp = getWarpInstance()
  return async (dispatch) => {
    dispatch(collectTxHashesPending(true))
    try {
      const { stellarTxHash, evrynetTxHash } = await warp.toEvrynet({
        evrynetPriv: dest,
        amount,
        asset,
        stellarPriv: src,
      })
      dispatch(collectTxHashesSuccess({ stellarTxHash, evrynetTxHash }))
    } catch (e) {
      dispatch(collectTxHashesError(e))
    }
  }
}

export const toStellar = ({ src, dest, amount, asset }) => {
  const warp = getWarpInstance()
  return async (dispatch) => {
    dispatch(collectTxHashesPending(true))
    try {
      const { stellarTxHash, evrynetTxHash } = await warp.toStellar({
        evrynetPriv: src,
        amount,
        asset,
        stellarPriv: dest,
      })
      dispatch(collectTxHashesSuccess({ stellarTxHash, evrynetTxHash }))
    } catch (e) {
      dispatch(collectTxHashesError(e))
    }
  }
}

export const getWhitelistAssetsSuccess = (whitelistedAssets) => ({
  type: actionTypes.ASYNC_GET_WHITELISTED_ASSETS.SUCCESS,
  payload: whitelistedAssets,
})

export const getWhitelistAssetsPending = (pendingStatus) => ({
  type: actionTypes.ASYNC_GET_WHITELISTED_ASSETS.PENDING,
  payload: pendingStatus,
})

export const getWhitelistAssetsError = (error) => ({
  type: actionTypes.ASYNC_GET_WHITELISTED_ASSETS.FAILURE,
  payload: error,
})

export const getWhitelistAssets = () => {
  const warp = getWarpInstance()
  return async (dispatch) => {
    dispatch(getWhitelistAssetsPending(true))
    try {
      const whitelistedAssets = await warp.client.evry.getWhitelistAssets()
      dispatch(getWhitelistAssetsSuccess(whitelistedAssets.assets))
    } catch (e) {
      dispatch(getWhitelistAssetsError(e))
    }
  }
}

export const getAccountBalanceSuccess = (whitelistedAssets) => ({
  type: actionTypes.ASYNC_GET_ACCOUNT_BALANCE.SUCCESS,
  payload: whitelistedAssets,
})

export const getAccountBalancePending = (pendingStatus) => ({
  type: actionTypes.ASYNC_GET_ACCOUNT_BALANCE.PENDING,
  payload: pendingStatus,
})

export const getAccountBalanceError = (error) => ({
  type: actionTypes.ASYNC_GET_ACCOUNT_BALANCE.FAILURE,
  payload: error,
})

export const getAccountBalance = ({ asset = {}, privateKey = '' }) => {
  const warp = getWarpInstance()
  const client = store.getState().warp[
    actionTypes.ASYNC_TOGGLE_WARP_SWITCH.stateKey
  ]
    ? warp.client.stellar
    : warp.client.evry
  return async (dispatch) => {
    dispatch(getAccountBalancePending(true))
    try {
      const address = client.getPublickeyFromPrivateKey(privateKey)
      const accountBalance = await client.getBalance({ address, asset })
      dispatch(getAccountBalanceSuccess(accountBalance.balance))
    } catch (e) {
      dispatch(getAccountBalanceError(e))
    }
  }
}

export const getTrustlinesSuccess = (trustlines) => ({
  type: actionTypes.ASYNC_GET_TRUSTLINES.SUCCESS,
  payload: trustlines,
})

export const getTrustlinesPending = (pendingStatus) => ({
  type: actionTypes.ASYNC_GET_TRUSTLINES.PENDING,
  payload: pendingStatus,
})

export const getTrustlinesError = (error) => ({
  type: actionTypes.ASYNC_GET_TRUSTLINES.FAILURE,
  payload: error,
})

export const getTrustlines = ({ privateKey = '' }) => {
  const warp = getWarpInstance()
  return async (dispatch) => {
    dispatch(getTrustlinesPending(true))
    try {
      const address = warp.client.stellar.getPublickeyFromPrivateKey(privateKey)
      const { assets } = await warp.client.stellar.getTrustlines(address)
      dispatch(getTrustlinesSuccess(assets))
    } catch (e) {
      dispatch(getTrustlinesError(e))
    }
  }
}

export const toggleTransferSwitch = () => ({
  type: actionTypes.ASYNC_TOGGLE_WARP_SWITCH.SUCCESS,
  payload: !store.getState().warp[
    actionTypes.ASYNC_TOGGLE_WARP_SWITCH.stateKey
  ],
})

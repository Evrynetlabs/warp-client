import actionTypes from 'Components/warp/warpActionTypes'
import Warp from 'warp-js'

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

export const toEvry = ({ srcStellarSecret, destEvryAddr, amount, asset }) => {
  const warp = new Warp()
  return async (dispatch) => {
    dispatch(collectTxHashesPending(true))
    try {
      const { stellarTxHash, evrynetTxHash } = await warp.toEvrynet({
        src: srcStellarSecret,
        amount,
        asset,
        evrynetAddress: destEvryAddr,
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
  const warp = new Warp()
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

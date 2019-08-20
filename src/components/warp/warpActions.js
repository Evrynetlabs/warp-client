import {
  COLLECT_HASHES_SUCESS,
  COLLECT_HASHES_PENDING,
  COLLECT_HASHES_ERROR,
} from 'Components/warp/warpActionTypes'

export const collectTxHashesSuccess = ({ stellarTxHashes, evryTxHashes }) => ({
  type: COLLECT_HASHES_SUCESS,
  payload: { stellarTxHashes, evryTxHashes },
})

export const collectTxHashesPending = (pendingStatus) => ({
  type: COLLECT_HASHES_PENDING,
  payload: pendingStatus,
})

export const collectTxHashesError = (error) => ({
  type: COLLECT_HASHES_ERROR,
  payload: error,
})

export const toEvry = ({ srcStellarSecret, destEvryAddr, amount, asset }) => {
  const warp = async () => {}
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

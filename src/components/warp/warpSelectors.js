import { createStructuredSelector } from 'reselect'

export const collectTxHashesData = (state) => state.warp.collectTxHashesData
export const collectTxHashesPending = (state) =>
  state.warp.collectTxHashesPending
export const collectTxHashesError = (state) => state.warp.collectTxHashesError

export const collectTxHashes = createStructuredSelector({
  collectTxHashesData,
  collectTxHashesPending,
  collectTxHashesError,
})

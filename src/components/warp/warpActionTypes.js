import { createAsyncMutation } from '@/utils/store'

export const ASYNC_COLLECT_HASHES = createAsyncMutation('COLLECT_HASHES')
export const ASYNC_GET_WHITELISTED_ASSETS = createAsyncMutation(
  'GET_WHITELISTED_ASSETS',
)
export const ASYNC_TOGGLE_WARP_SWITCH = createAsyncMutation('IS_TO_EVRY')
export const ASYNC_TOGGLE_GET_ACCOUNT_BALANCE = createAsyncMutation(
  'GET_ACCOUNT_BALANCE',
)

export default {
  ASYNC_COLLECT_HASHES,
  ASYNC_GET_WHITELISTED_ASSETS,
  ASYNC_TOGGLE_WARP_SWITCH,
  ASYNC_TOGGLE_GET_ACCOUNT_BALANCE,
}

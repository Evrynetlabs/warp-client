import { createAsyncMutation } from '@/utils/store'

export const ASYNC_COLLECT_HASHES = createAsyncMutation('COLLECT_HASHES')
export const ASYNC_GET_WHITELISTED_ASSETS = createAsyncMutation(
  'GET_WHITELISTED_ASSETS',
)

export default {
  ASYNC_COLLECT_HASHES,
  ASYNC_GET_WHITELISTED_ASSETS,
}

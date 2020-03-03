import actionTypes from 'Components/healthcheck/healthCheckActionTypes'
import { HealthCheckException } from '@/exceptions'
import { getWarpInstance } from '@/utils/singleton'

export const healthCheckSuccess = () => ({
  type: actionTypes.ASYNC_HEALTH_CHECK.SUCCESS,
  payload: true,
})

export const healthCheckPending = (pendingStatus) => ({
  type: actionTypes.ASYNC_HEALTH_CHECK.PENDING,
  payload: pendingStatus,
})

export const healthCheckError = (error) => ({
  type: actionTypes.ASYNC_HEALTH_CHECK.FAILURE,
  payload: error,
})

export const doHealthCheck = () => {
  const warp = getWarpInstance()
  return async (dispatch) => {
    dispatch(healthCheckPending(true))
    try {
      const isListening = await warp.client.net.isListening()
      if (!isListening) {
        dispatch(healthCheckError(new HealthCheckException(`not listening`)))
        return
      }
      dispatch(healthCheckSuccess())
    } catch (e) {
      dispatch(healthCheckError(e))
    }
  }
}

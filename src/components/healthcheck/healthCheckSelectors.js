import healthCheckActionTypes from 'Components/healthcheck/healthCheckActionTypes'
import { createStructuredSelector } from 'reselect'

export const selectHealthCheck = createStructuredSelector({
  state: (state) => {
    return state.healthCheck[healthCheckActionTypes.ASYNC_HEALTH_CHECK.stateKey]
  },
  loading: (state) => {
    return state.healthCheck[
      healthCheckActionTypes.ASYNC_HEALTH_CHECK.loadingKey
    ]
  },
  error: (state) => {
    return state.healthCheck[healthCheckActionTypes.ASYNC_HEALTH_CHECK.errorKey]
  },
})

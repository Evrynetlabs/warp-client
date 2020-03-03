import reducer, { initState } from 'Components/healthcheck/healthCheckReducer'
import actionTypes from 'Components/healthcheck/healthCheckActionTypes'

describe('Faucet reducer', () => {
  it('should return the initial state', () => {
    const expectedInitialState = initState
    expect(reducer(undefined, {})).toEqual(expectedInitialState())
  })

  it('should handle ASYNC_HEALTH_CHECK.SUCCESS case', () => {
    const payload = true
    const expectedStates = {
      [actionTypes.ASYNC_HEALTH_CHECK.stateKey]: payload,
      [actionTypes.ASYNC_HEALTH_CHECK.loadingKey]: false,
      [actionTypes.ASYNC_HEALTH_CHECK.errorKey]: null,
    }
    expect(
      reducer(undefined, {
        type: actionTypes.ASYNC_HEALTH_CHECK.SUCCESS,
        payload,
      }),
    ).toEqual({
      ...initState(),
      ...expectedStates,
    })
  })

  it('should handle ASYNC_HEALTH_CHECK.PENDING case', () => {
    const payload = true
    const expectedStates = {
      [actionTypes.ASYNC_HEALTH_CHECK.stateKey]: null,
      [actionTypes.ASYNC_HEALTH_CHECK.loadingKey]: payload,
      [actionTypes.ASYNC_HEALTH_CHECK.errorKey]: null,
    }
    expect(
      reducer(undefined, {
        type: actionTypes.ASYNC_HEALTH_CHECK.PENDING,
        payload,
      }),
    ).toEqual({
      ...initState(),
      ...expectedStates,
    })
  })

  it('should handle ASYNC_HEALTH_CHECK.FAILURE case', () => {
    const payload = new Error('this is an error')
    const expectedStates = {
      [actionTypes.ASYNC_HEALTH_CHECK.stateKey]: null,
      [actionTypes.ASYNC_HEALTH_CHECK.loadingKey]: false,
      [actionTypes.ASYNC_HEALTH_CHECK.errorKey]: payload,
    }
    expect(
      reducer(undefined, {
        type: actionTypes.ASYNC_HEALTH_CHECK.FAILURE,
        payload,
      }),
    ).toEqual({
      ...initState(),
      ...expectedStates,
    })
  })
})

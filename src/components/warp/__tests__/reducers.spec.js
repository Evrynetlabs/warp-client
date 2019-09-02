import reducer from 'Components/warp/warpReducers'
import actionTypes from 'Components/warp/warpActionTypes'

const expectedInitialState = () => {
  return {
    [actionTypes.ASYNC_COLLECT_HASHES.stateKey]: null,
    [actionTypes.ASYNC_COLLECT_HASHES.loadingKey]: false,
    [actionTypes.ASYNC_COLLECT_HASHES.errorKey]: null,
    [actionTypes.ASYNC_GET_WHITELISTED_ASSETS.stateKey]: [],
    [actionTypes.ASYNC_GET_WHITELISTED_ASSETS.loadingKey]: false,
    [actionTypes.ASYNC_GET_WHITELISTED_ASSETS.errorKey]: null,
  }
}

describe('warp reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(expectedInitialState())
  })

  it('should handle COLLECT_HASHES_SUCCESS', () => {
    expect(
      reducer(undefined, {
        type: actionTypes.ASYNC_COLLECT_HASHES.SUCCESS,
        payload: { stellarTxHash: 'foo', evrynetTxHash: 'bar' },
      }),
    ).toEqual({
      ...expectedInitialState(),
      [actionTypes.ASYNC_COLLECT_HASHES.stateKey]: {
        stellar: 'foo',
        evry: 'bar',
      },
    })
  })

  it('should handle COLLECT_HASHES_PENDING', () => {
    expect(
      reducer(undefined, {
        type: actionTypes.ASYNC_COLLECT_HASHES.PENDING,
        payload: true,
      }),
    ).toEqual({
      ...expectedInitialState(),
      [actionTypes.ASYNC_COLLECT_HASHES.loadingKey]: true,
    })
  })

  it('should handle COLLECT_HASHES_FAILURE', () => {
    expect(
      reducer(undefined, {
        type: actionTypes.ASYNC_COLLECT_HASHES.FAILURE,
        payload: new Error('this is an error'),
      }),
    ).toEqual({
      ...expectedInitialState(),
      [actionTypes.ASYNC_COLLECT_HASHES.errorKey]: new Error(
        'this is an error',
      ),
    })
  })
})

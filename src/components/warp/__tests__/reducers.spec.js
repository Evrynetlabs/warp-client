import reducer, { initState } from 'Components/warp/warpReducers'
import actionTypes from 'Components/warp/warpActionTypes'

const expectedInitialState = initState

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
      [actionTypes.ASYNC_COLLECT_HASHES.loadingKey]: false,
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
      [actionTypes.ASYNC_COLLECT_HASHES.loadingKey]: false,
    })
  })
})

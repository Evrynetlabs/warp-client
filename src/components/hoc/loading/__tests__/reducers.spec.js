import reducer, { initState } from 'Components/hoc/loading/loadingReducers'
import actionTypes from 'Components/hoc/loading/loadingActionTypes'
const expectedInitialState = initState

describe('Loading reducers', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(expectedInitialState())
  })
  describe('When action payload is start loading', () => {
    it('should handle COLLECT_HASHES_SUCCESS', () => {
      expect(
        reducer(undefined, {
          type: actionTypes.START_LOADING,
        }),
      ).toEqual({
        ...expectedInitialState(),
        isLoading: true,
      })
    })
  })

  describe('When action payload is stop', () => {
    it('should handle COLLECT_HASHES_SUCCESS', () => {
      expect(
        reducer(undefined, {
          type: actionTypes.STOP_LOADING,
        }),
      ).toEqual({
        ...expectedInitialState(),
        isLoading: false,
      })
    })
  })

  describe('When action payload type is default', () => {
    it('should handle COLLECT_HASHES_SUCCESS', () => {
      expect(reducer(undefined, { type: undefined })).toEqual({
        ...expectedInitialState(),
      })
    })
  })
})

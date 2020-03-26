import {
  startLoading,
  stopLoading,
} from 'Components/hoc/loading/loadingActions'
import actionTypes from 'Components/hoc/loading/loadingActionTypes'

describe('Loading actions', () => {
  describe('startLoading', () => {
    it('should set isLoading to be true', () => {
      const expectedActions = {
        type: actionTypes.START_LOADING,
      }
      expect(startLoading()).toEqual(expectedActions)
    })
  })
  describe('stopLoading', () => {
    it('should set isLoading to be false', () => {
      const expectedActions = {
        type: actionTypes.STOP_LOADING,
      }
      expect(stopLoading()).toEqual(expectedActions)
    })
  })
})

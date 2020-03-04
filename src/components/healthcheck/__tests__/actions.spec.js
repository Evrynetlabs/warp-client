import {
  doHealthCheck,
  healthCheckSuccess,
  healthCheckPending,
  healthCheckError,
} from 'Components/healthcheck/healthCheckActions'
import actionTypes from 'Components/healthcheck/healthCheckActionTypes'
import { initState } from 'Components/healthcheck/healthCheckReducer'
import thunk from 'redux-thunk'
import configureMockStore from 'redux-mock-store'
import { HealthCheckException } from '@/exceptions'
jest.mock('warp-js')
import { spyIsListening } from 'warp-js'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)
let store

describe('HealthCheck actions', () => {
  beforeEach(() => {
    jest.resetModules()
    store = mockStore(initState())
  })

  describe('With async action', () => {
    describe('When calling HealthCheck', () => {
      describe('When an api response the data successfully', () => {
        it('successfully dispatch to synchronous healthCheck success action', () => {
          const expectedActions = [
            { type: actionTypes.ASYNC_HEALTH_CHECK.PENDING, payload: true },
            {
              type: actionTypes.ASYNC_HEALTH_CHECK.SUCCESS,
              payload: true,
            },
          ]
          spyIsListening.mockResolvedValueOnce(true)
          return store.dispatch(doHealthCheck()).then(() => {
            expect(store.getActions()).toEqual(expectedActions)
          })
        })
      })

      describe('When an api response false', () => {
        it('successfully dispatch to collect hashes action', () => {
          const expectedActions = [
            { type: actionTypes.ASYNC_HEALTH_CHECK.PENDING, payload: true },
            {
              type: actionTypes.ASYNC_HEALTH_CHECK.FAILURE,
              payload: new HealthCheckException(`not listening`),
            },
          ]
          spyIsListening.mockResolvedValueOnce(false)
          return store.dispatch(doHealthCheck()).then(() => {
            expect(store.getActions()).toEqual(expectedActions)
          })
        })
      })

      describe('When an api response an error', () => {
        it('successfully dispatch to collect hashes action', () => {
          const expectedActions = [
            { type: actionTypes.ASYNC_HEALTH_CHECK.PENDING, payload: true },
            {
              type: actionTypes.ASYNC_HEALTH_CHECK.FAILURE,
              payload: new Error('this is an error'),
            },
          ]
          spyIsListening.mockRejectedValue(new Error('this is an error'))
          return store.dispatch(doHealthCheck()).then(() => {
            expect(store.getActions()).toEqual(expectedActions)
          })
        })
      })
    })
  })

  describe('When synchronous action', () => {
    describe('healthCheckSuccess', () => {
      it('should correctly set the payload', () => {
        const payload = true
        const expectedActions = {
          type: actionTypes.ASYNC_HEALTH_CHECK.SUCCESS,
          payload,
        }
        expect(healthCheckSuccess()).toEqual(expectedActions)
      })
    })

    describe('healthCheckPending', () => {
      it('should correctly set the payload', () => {
        const payload = true
        const expectedActions = {
          type: actionTypes.ASYNC_HEALTH_CHECK.PENDING,
          payload,
        }
        expect(healthCheckPending(payload)).toEqual(expectedActions)
      })
    })

    describe('healthCheckError', () => {
      it('should correctly set the payload', () => {
        const payload = 'foo'
        const expectedActions = {
          type: actionTypes.ASYNC_HEALTH_CHECK.FAILURE,
          payload,
        }
        expect(healthCheckError(payload)).toEqual(expectedActions)
      })
    })
  })
})

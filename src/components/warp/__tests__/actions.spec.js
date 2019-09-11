import {
  toEvry,
  getWhitelistAssets,
  toStellar,
  toggleTransferSwitch,
} from 'Components/warp/warpActions'
import actionTypes from 'Components/warp/warpActionTypes'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
jest.mock('warp-js')
import { spyToEvrynet, spyGetWhitelistAssets, spyToStellar } from 'warp-js'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

describe('Warp actions', () => {
  describe('toEvry', () => {
    describe('When success', () => {
      it('should get txHashes', () => {
        const toEvrynetResult = {
          stellarTxHash: 'foo',
          evrynetTxHash: 'bar',
        }
        const expectedActions = [
          { type: actionTypes.ASYNC_COLLECT_HASHES.PENDING, payload: true },
          {
            type: actionTypes.ASYNC_COLLECT_HASHES.SUCCESS,
            payload: toEvrynetResult,
          },
        ]
        spyToEvrynet.mockResolvedValueOnce(toEvrynetResult)
        const store = mockStore({
          [actionTypes.ASYNC_COLLECT_HASHES.stateKey]: null,
          [actionTypes.ASYNC_COLLECT_HASHES.loadingKey]: false,
          [actionTypes.ASYNC_COLLECT_HASHES.errorKey]: null,
        })
        return store
          .dispatch(
            toEvry({
              src: 'foo',
              dest: 'bar',
              amount: '1',
              asset: {},
            }),
          )
          .then(() => {
            expect(store.getActions()).toEqual(expectedActions)
          })
      })
    })

    describe('when error', () => {
      it('should report error', () => {
        const expectedActions = [
          { type: actionTypes.ASYNC_COLLECT_HASHES.PENDING, payload: true },
          {
            type: actionTypes.ASYNC_COLLECT_HASHES.FAILURE,
            payload: new Error('this is an error'),
          },
        ]
        spyToEvrynet.mockRejectedValue(new Error('this is an error'))
        const store = mockStore({
          [actionTypes.ASYNC_COLLECT_HASHES.stateKey]: null,
          [actionTypes.ASYNC_COLLECT_HASHES.loadingKey]: false,
          [actionTypes.ASYNC_COLLECT_HASHES.errorKey]: null,
        })
        return store
          .dispatch(
            toEvry({
              src: 'foo',
              dest: 'bar',
              amount: '1',
              asset: {},
            }),
          )
          .then(() => {
            expect(store.getActions()).toEqual(expectedActions)
          })
      })
    })
  })

  describe('toStellar', () => {
    describe('When success', () => {
      it('should get txHashes', () => {
        const toEvrynetResult = {
          stellarTxHash: 'foo',
          evrynetTxHash: 'bar',
        }
        const expectedActions = [
          { type: actionTypes.ASYNC_COLLECT_HASHES.PENDING, payload: true },
          {
            type: actionTypes.ASYNC_COLLECT_HASHES.SUCCESS,
            payload: toEvrynetResult,
          },
        ]
        spyToStellar.mockResolvedValueOnce(toEvrynetResult)
        const store = mockStore({
          [actionTypes.ASYNC_COLLECT_HASHES.stateKey]: null,
          [actionTypes.ASYNC_COLLECT_HASHES.loadingKey]: false,
          [actionTypes.ASYNC_COLLECT_HASHES.errorKey]: null,
        })
        return store
          .dispatch(
            toStellar({
              src: 'foo',
              dest: 'bar',
              amount: '1',
              asset: {},
            }),
          )
          .then(() => {
            expect(store.getActions()).toEqual(expectedActions)
          })
      })
    })

    describe('when error', () => {
      it('should report error', () => {
        const expectedActions = [
          { type: actionTypes.ASYNC_COLLECT_HASHES.PENDING, payload: true },
          {
            type: actionTypes.ASYNC_COLLECT_HASHES.FAILURE,
            payload: new Error('this is an error'),
          },
        ]
        spyToStellar.mockRejectedValue(new Error('this is an error'))
        const store = mockStore({
          [actionTypes.ASYNC_COLLECT_HASHES.stateKey]: null,
          [actionTypes.ASYNC_COLLECT_HASHES.loadingKey]: false,
          [actionTypes.ASYNC_COLLECT_HASHES.errorKey]: null,
        })
        return store
          .dispatch(
            toStellar({
              src: 'foo',
              dest: 'bar',
              amount: '1',
              asset: {},
            }),
          )
          .then(() => {
            expect(store.getActions()).toEqual(expectedActions)
          })
      })
    })
  })

  describe('getWhitelistAssets', () => {
    describe('When success', () => {
      it('should get txHashes', () => {
        const getWhitlistAssetsResult = {
          assets: [{ issuer: 'foo', decimal: 'bar', code: 'foo' }],
        }
        const expectedActions = [
          {
            type: actionTypes.ASYNC_GET_WHITELISTED_ASSETS.PENDING,
            payload: true,
          },
          {
            type: actionTypes.ASYNC_GET_WHITELISTED_ASSETS.SUCCESS,
            payload: getWhitlistAssetsResult.assets,
          },
        ]
        spyGetWhitelistAssets.mockResolvedValueOnce(getWhitlistAssetsResult)
        const store = mockStore({
          [actionTypes.ASYNC_GET_WHITELISTED_ASSETS.stateKey]: null,
          [actionTypes.ASYNC_GET_WHITELISTED_ASSETS.loadingKey]: false,
          [actionTypes.ASYNC_GET_WHITELISTED_ASSETS.errorKey]: null,
        })
        return store.dispatch(getWhitelistAssets()).then(() => {
          expect(store.getActions()).toEqual(expectedActions)
        })
      })
    })

    describe('When error', () => {
      it('should report error', () => {
        const expectedActions = [
          {
            type: actionTypes.ASYNC_GET_WHITELISTED_ASSETS.PENDING,
            payload: true,
          },
          {
            type: actionTypes.ASYNC_GET_WHITELISTED_ASSETS.FAILURE,
            payload: new Error('this is an error'),
          },
        ]
        spyGetWhitelistAssets.mockRejectedValue(new Error('this is an error'))
        const store = mockStore({
          [actionTypes.ASYNC_GET_WHITELISTED_ASSETS.stateKey]: null,
          [actionTypes.ASYNC_GET_WHITELISTED_ASSETS.loadingKey]: false,
          [actionTypes.ASYNC_GET_WHITELISTED_ASSETS.errorKey]: null,
        })
        return store.dispatch(getWhitelistAssets()).then(() => {
          expect(store.getActions()).toEqual(expectedActions)
        })
      })
    })
  })

  describe('toggleTransferSwitch', () => {
    it('should toggle warp switch successfully', async () => {
      const expectedActions = [
        {
          type: actionTypes.ASYNC_TOGGLE_WARP_SWITCH.SUCCESS,
          payload: false,
        },
      ]
      const store = mockStore({
        [actionTypes.ASYNC_TOGGLE_WARP_SWITCH.stateKey]: true,
      })
      await store.dispatch(toggleTransferSwitch())
      expect(store.getActions()).toEqual(expectedActions)
    })
  })
})

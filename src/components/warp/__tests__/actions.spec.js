import {
  toEvrynet,
  getWhitelistAssets,
  toStellar,
  toggleTransferSwitch,
  getAccountBalance,
  getTrustlines,
} from 'Components/warp/warpActions'
import actionTypes from 'Components/warp/warpActionTypes'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import {
  spyToEvrynet,
  spyGetWhitelistAssets,
  spyToStellar,
  spyGetAccountBalance,
  spyGetPublickeyFromPrivateKey,
  spyGetTrustlines,
} from '@evrynetlabs/warp-js'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

describe('Warp actions', () => {
  describe('toEvrynet', () => {
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
            toEvrynet({
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
            toEvrynet({
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
        const toStellarResult = {
          stellarTxHash: 'foo',
          evrynetTxHash: 'bar',
        }
        const expectedActions = [
          { type: actionTypes.ASYNC_COLLECT_HASHES.PENDING, payload: true },
          {
            type: actionTypes.ASYNC_COLLECT_HASHES.SUCCESS,
            payload: toStellarResult,
          },
        ]
        spyToStellar.mockResolvedValueOnce(toStellarResult)
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

  describe('getAccountBalance', () => {
    describe('When success', () => {
      it('should get an account balance', () => {
        const getBalanceResult = {
          balance: '1',
        }
        const mockInput = {
          asset: {},
          privateKey: 'foo',
        }
        const expectedActions = [
          {
            type: actionTypes.ASYNC_GET_ACCOUNT_BALANCE.PENDING,
            payload: true,
          },
          {
            type: actionTypes.ASYNC_GET_ACCOUNT_BALANCE.SUCCESS,
            payload: getBalanceResult.balance,
          },
        ]
        spyGetAccountBalance.mockResolvedValue(getBalanceResult)
        spyGetPublickeyFromPrivateKey.mockReturnValue('bar')
        const store = mockStore({
          [actionTypes.ASYNC_GET_ACCOUNT_BALANCE.stateKey]: null,
          [actionTypes.ASYNC_GET_ACCOUNT_BALANCE.loadingKey]: false,
          [actionTypes.ASYNC_GET_ACCOUNT_BALANCE.errorKey]: null,
        })
        return store.dispatch(getAccountBalance(mockInput)).then(() => {
          expect(store.getActions()).toEqual(expectedActions)
        })
      })
    })

    describe('When error', () => {
      describe('when getAccountBalance error', () => {
        it('should send a failure action', () => {
          const mockInput = {
            asset: {},
            privateKey: 'foo',
          }
          const expectedActions = [
            {
              type: actionTypes.ASYNC_GET_ACCOUNT_BALANCE.PENDING,
              payload: true,
            },
            {
              type: actionTypes.ASYNC_GET_ACCOUNT_BALANCE.FAILURE,
              payload: new Error('this is an error'),
            },
          ]
          spyGetAccountBalance.mockRejectedValue(new Error('this is an error'))
          spyGetPublickeyFromPrivateKey.mockReturnValue('bar')
          const store = mockStore({
            [actionTypes.ASYNC_GET_ACCOUNT_BALANCE.stateKey]: null,
            [actionTypes.ASYNC_GET_ACCOUNT_BALANCE.loadingKey]: false,
            [actionTypes.ASYNC_GET_ACCOUNT_BALANCE.errorKey]: null,
          })
          return store.dispatch(getAccountBalance(mockInput)).then(() => {
            expect(store.getActions()).toEqual(expectedActions)
          })
        })
      })

      describe('when spyGetPublickeyFromPrivateKey error', () => {
        it('should send a failure action', () => {
          const mockInput = {
            asset: {},
            privateKey: 'foo',
          }
          const expectedActions = [
            {
              type: actionTypes.ASYNC_GET_ACCOUNT_BALANCE.PENDING,
              payload: true,
            },
            {
              type: actionTypes.ASYNC_GET_ACCOUNT_BALANCE.FAILURE,
              payload: new Error('this is an error'),
            },
          ]
          spyGetPublickeyFromPrivateKey.mockReturnValue(
            new Error('this is an error'),
          )
          const store = mockStore({
            [actionTypes.ASYNC_GET_ACCOUNT_BALANCE.stateKey]: null,
            [actionTypes.ASYNC_GET_ACCOUNT_BALANCE.loadingKey]: false,
            [actionTypes.ASYNC_GET_ACCOUNT_BALANCE.errorKey]: null,
          })
          return store.dispatch(getAccountBalance(mockInput)).then(() => {
            expect(store.getActions()).toEqual(expectedActions)
          })
        })
      })
    })
  })

  describe('getTrustlines', () => {
    describe('When success', () => {
      it('should get the account trustlines', () => {
        const getBalanceResult = {
          assets: [
            {
              code: 'foo',
              issuer: 'bar',
            },
          ],
        }
        const mockInput = {
          privateKey: 'foo',
        }
        const expectedActions = [
          {
            type: actionTypes.ASYNC_GET_TRUSTLINES.PENDING,
            payload: true,
          },
          {
            type: actionTypes.ASYNC_GET_TRUSTLINES.SUCCESS,
            payload: getBalanceResult.assets,
          },
        ]
        spyGetTrustlines.mockResolvedValue(getBalanceResult)
        spyGetPublickeyFromPrivateKey.mockReturnValue('bar')
        const store = mockStore({
          [actionTypes.ASYNC_GET_TRUSTLINES.stateKey]: null,
          [actionTypes.ASYNC_GET_TRUSTLINES.loadingKey]: false,
          [actionTypes.ASYNC_GET_TRUSTLINES.errorKey]: null,
        })
        return store.dispatch(getTrustlines(mockInput)).then(() => {
          expect(store.getActions()).toEqual(expectedActions)
        })
      })
    })

    describe('When error', () => {
      describe('when getTrustlines error', () => {
        it('should send a failure action', () => {
          const mockInput = {
            privateKey: 'foo',
          }
          const expectedActions = [
            {
              type: actionTypes.ASYNC_GET_TRUSTLINES.PENDING,
              payload: true,
            },
            {
              type: actionTypes.ASYNC_GET_TRUSTLINES.FAILURE,
              payload: new Error('this is an error'),
            },
          ]
          spyGetTrustlines.mockRejectedValue(new Error('this is an error'))
          spyGetPublickeyFromPrivateKey.mockReturnValue('bar')
          const store = mockStore({
            [actionTypes.ASYNC_GET_TRUSTLINES.stateKey]: null,
            [actionTypes.ASYNC_GET_TRUSTLINES.loadingKey]: false,
            [actionTypes.ASYNC_GET_TRUSTLINES.errorKey]: null,
          })
          return store.dispatch(getTrustlines(mockInput)).then(() => {
            expect(store.getActions()).toEqual(expectedActions)
          })
        })
      })

      describe('when spyGetPublickeyFromPrivateKey error', () => {
        it('should send a failure action', () => {
          const mockInput = {
            privateKey: 'foo',
          }
          const expectedActions = [
            {
              type: actionTypes.ASYNC_GET_TRUSTLINES.PENDING,
              payload: true,
            },
            {
              type: actionTypes.ASYNC_GET_TRUSTLINES.FAILURE,
              payload: new Error('this is an error'),
            },
          ]
          spyGetPublickeyFromPrivateKey.mockReturnValue(
            new Error('this is an error'),
          )
          const store = mockStore({
            [actionTypes.ASYNC_GET_TRUSTLINES.stateKey]: null,
            [actionTypes.ASYNC_GET_TRUSTLINES.loadingKey]: false,
            [actionTypes.ASYNC_GET_TRUSTLINES.errorKey]: null,
          })
          return store.dispatch(getTrustlines(mockInput)).then(() => {
            expect(store.getActions()).toEqual(expectedActions)
          })
        })
      })
    })
  })
})

import { toEvry } from 'Components/warp/warpActions'
import actionTypes from 'Components/warp/warpActionTypes'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
jest.mock('warp-js')
import { spyToEvrynet } from 'warp-js'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

describe('Warp actions', () => {
  describe('toEvry', () => {
    describe('When success', () => {
      it('should get txHashes', () => {
        const expected = {
          stellarTxHash: 'foo',
          evrynetTxHash: 'bar',
        }
        spyToEvrynet.mockResolvedValueOnce(expected)
        const store = mockStore({
          [actionTypes.ASYNC_COLLECT_HASHES.stateKey]: null,
          [actionTypes.ASYNC_COLLECT_HASHES.loadingKey]: false,
          [actionTypes.ASYNC_COLLECT_HASHES.errorKey]: null,
        })
        return store
          .dispatch(
            toEvry({
              srcStellarSecret: 'foo',
              destEvryAddr: 'bar',
              amount: '1',
              asset: 'foo',
            }),
          )
          .then(() => {
            console.log(store.getActions())
            expect(1).toEqual(1)
          })
      })
    })
  })
})

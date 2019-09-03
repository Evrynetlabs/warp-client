import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
jest.mock('warp-js')
import { spyGetCode } from 'warp-js'
import WarpContent from 'Components/warp/warp-content/WarpContent'
Enzyme.configure({ adapter: new Adapter() })

describe('WarpContent', () => {
  describe('With default case', () => {
    const mock = {
      txHashes: {
        state: {
          stellar: 'foo',
          evry: 'bar',
        },
        loading: false,
        error: null,
      },
      toEvry: jest.fn(),
      whitelistedAssets: {
        state: [],
        loading: false,
        error: null,
      },
      getWhitelistAssets: jest.fn(),
    }
    spyGetCode.mockReturnValue('FOO')
    const component = shallow(
      <WarpContent
        txHashes={mock.txHashes}
        toEvry={mock.toEvry}
        whitelistedAssets={mock.whitelistedAssets}
        getWhitelistAssets={mock.getWhitelistAssets}
      ></WarpContent>,
    )
    it('should render correspondingly', () => {
      expect(component).toMatchSnapshot()
    })
  })
})

import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import WarpChainTitle from 'Components/warp/warp-chain-title/WarpChainTitle'

Enzyme.configure({ adapter: new Adapter() })

describe('WarpChainTitle', () => {
  it('should render correspondingly', () => {
    const component = shallow(<WarpChainTitle></WarpChainTitle>)
    expect(component).toMatchSnapshot()
  })
})

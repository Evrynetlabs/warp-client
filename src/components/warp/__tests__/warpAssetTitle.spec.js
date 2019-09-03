import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import WarpAssetTitle from 'Components/warp/warp-asset-title/WarpAssetTitle'

Enzyme.configure({ adapter: new Adapter() })

describe('WarpAssetTitle', () => {
  it('should render correspondingly', () => {
    const component = shallow(<WarpAssetTitle></WarpAssetTitle>)
    expect(component).toMatchSnapshot()
  })
})

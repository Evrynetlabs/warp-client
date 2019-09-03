import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import WarpContainer from 'Components/warp/warpContainer'
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { initState } from 'Components/warp/warpReducers'

Enzyme.configure({ adapter: new Adapter() })

describe('Warp', () => {
  const mockStore = configureStore([thunk])
  let store, container

  beforeEach(() => {
    store = mockStore({
      warp: initState(),
    })
    container = shallow(<WarpContainer store={store} />)
  })
  it('should render correspondingly', () => {
    expect(container).toMatchSnapshot()
  })
})

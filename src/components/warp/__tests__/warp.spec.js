import { shallow } from 'enzyme'
import React from 'react'
import WarpContainer from 'Components/warp/warpContainer'
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { initState } from 'Components/warp/warpReducers'

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

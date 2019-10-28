import React from 'react'
import { shallow } from 'enzyme'
import withLoading from 'Components/hoc/loading/loadingContainer'
import configureStore from 'redux-mock-store'

let mockStore

describe('Warp', () => {
  beforeEach(() => {
    mockStore = configureStore()
  })
  describe('When is loading is true', () => {
    it('should render correspondingly', () => {
      const store = mockStore({
        loading: {
          isLoading: true,
        },
      })
      const myComponent = () => {
        return <div></div>
      }
      const WithLoadingComponent = withLoading(myComponent)
      const wrapper = shallow(
        <WithLoadingComponent store={store}></WithLoadingComponent>,
      )
      expect(wrapper).toMatchSnapshot()
    })
  })
  describe('When is stop loading', () => {
    it('should render correspondingly', () => {
      const store = mockStore({
        loading: {
          isLoading: true,
        },
      })
      const myComponent = () => {
        return <div></div>
      }
      const WithLoadingComponent = withLoading(myComponent)
      const wrapper = shallow(
        <WithLoadingComponent store={store}></WithLoadingComponent>,
      )
      expect(wrapper).toMatchSnapshot()
    })
  })
})

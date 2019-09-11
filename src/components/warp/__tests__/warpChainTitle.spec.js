import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import WarpChainTitle from 'Components/warp/warp-chain-title/WarpChainTitle'

Enzyme.configure({ adapter: new Adapter() })

describe('WarpChainTitle', () => {
  const mock = {
    isToEvry: true,
    toggleTransferSwitch: jest.fn(),
  }
  let component
  beforeEach(() => {
    component = shallow(
      <WarpChainTitle
        isToEvry={mock.isToEvry}
        toggleTransferSwitch={mock.toggleTransferSwitch}
      ></WarpChainTitle>,
    )
  })
  it('should render correspondingly', () => {
    expect(component).toMatchSnapshot()
  })

  describe('When clicking toggle button', () => {
    it('should toggle a toggleTransferSwitch button', () => {
      component.find('.WarpChainTitle__swap').simulate('click')
      expect(mock.toggleTransferSwitch).toBeCalled()
    })

    it('should change source and destination of warp title', () => {
      mock.toggleTransferSwitch.mockImplementation(() => {
        component.setProps({
          isToEvry: false,
        })
      })
      component.find('.WarpChainTitle__swap').simulate('click')
      expect(component.state().swap).toEqual({
        dest: 'Stellar',
        src: 'EVRY',
      })
      expect(component).toMatchSnapshot()
    })
  })
})

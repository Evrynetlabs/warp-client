import React from 'react'
import { shallow } from 'enzyme'
import WarpChainTitle from 'Components/warp/warp-chain-title/WarpChainTitle'

describe('WarpChainTitle', () => {
  const mock = {
    isToEvrynet: true,
    toggleTransferSwitch: jest.fn(),
  }
  let component
  beforeEach(() => {
    component = shallow(
      <WarpChainTitle
        isToEvrynet={mock.isToEvrynet}
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
          isToEvrynet: false,
        })
      })
      component.find('.WarpChainTitle__swap').simulate('click')
      expect(component.state().swap).toEqual({
        dest: 'Stellar',
        src: 'Evrynet',
      })
      expect(component).toMatchSnapshot()
    })
  })
})

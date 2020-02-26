import React from 'react'

import { shallow } from 'enzyme'
import MaskPassInput from 'Components/shared/mask-input/MaskPasswordInput'

describe('MaskPasswordInput', () => {
  describe('When open mask input', () => {
    test('icon should contain slash', () => {
      const component = shallow(<MaskPassInput></MaskPassInput>)

      expect(component.find('.fa-eye-slash').length).toBe(1)
      expect(component).toMatchSnapshot()
    })
  })

  describe('When close mask input', () => {
    test('icon should contain slash', () => {
      const component = shallow(<MaskPassInput></MaskPassInput>)
      component.find('.MaskPasswordInput__mask__btn').simulate('click')
      expect(component.find('.fa-eye').length).toBe(1)
      expect(component).toMatchSnapshot()
    })
  })
})

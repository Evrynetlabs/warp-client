import React from 'react'
import { shallow } from 'enzyme'
import Result from 'Components/result/Result.js'

describe('Result', () => {
  const mockSuccessHashes = {
    state: {
      stellar: 'foo',
      evrynet: 'bar',
    },
    error: null,
  }
  const mock = {
    push: jest.fn(),
    isToEvrynet: true,
    amount: '1000',
    asset: { code: 'EVRY', decimal: 7 },
    src: 'foo',
    dest: 'bar',
    removeResult: jest.fn(),
  }

  describe('When the transfer process is success', () => {
    describe('When isToEverynet', () => {
      it('should render correspondingly', () => {
        const component = shallow(
          <Result
            {...{
              ...mock,
              txHashes: mockSuccessHashes,
            }}
            push={mock.push}
          ></Result>,
        )
        expect(component).toMatchSnapshot()
      })
    })

    describe('When isToStellar', () => {
      it('should render correspondingly', () => {
        const component = shallow(
          <Result
            {...{
              ...mock,
              txHashes: mockSuccessHashes,
              isToEvrynet: false,
            }}
            push={mock.push}
          ></Result>,
        )
        expect(component).toMatchSnapshot()
      })
    })
  })

  describe('When close the modal', () => {
    it('should call a removeResult', () => {
      const component = shallow(
        <Result
          {...{
            ...mock,
            txHashes: mockSuccessHashes,
          }}
          push={mock.push}
        ></Result>,
      )
      component.find('.Result__close__btn').simulate('click')
      expect(mock.removeResult).toHaveBeenCalled()
    })
  })
})

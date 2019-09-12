import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
jest.mock('warp-js')
import { spyGetCode } from 'warp-js'
import WarpContent from 'Components/warp/warp-content/WarpContent'
Enzyme.configure({ adapter: new Adapter() })
import { Form } from 'react-bootstrap'

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
      toStellar: jest.fn(),
      toEvry: jest.fn(),
      whitelistedAssets: {
        state: [],
        loading: false,
        error: null,
      },
      getWhitelistAssets: jest.fn(),
      isToEvry: true,
    }
    spyGetCode.mockReturnValue('FOO')
    let component

    beforeEach(() => {
      component = shallow(
        <WarpContent
          txHashes={mock.txHashes}
          toEvry={mock.toEvry}
          toStellar={mock.toStellar}
          whitelistedAssets={mock.whitelistedAssets}
          getWhitelistAssets={mock.getWhitelistAssets}
          isToEvry={mock.isToEvry}
        ></WarpContent>,
      )
    })

    it('should render correspondingly', () => {
      expect(component).toMatchSnapshot()
    })

    describe('When input an account souce', () => {
      const expected = 'foo'
      const mockEvent = {
        target: {
          value: expected,
          name: 'sourceAccount',
        },
      }
      it('should save a source account state correspondingly when on chaning input', () => {
        component
          .find('.WarpContent__form__content__input__src')
          .simulate('change', mockEvent)
        expect(component.state().formControls.sourceAccount.value).toEqual(
          expected,
        )
      })
    })

    describe('When input an account destination', () => {
      const expected = 'foo'
      const mockEvent = {
        target: {
          value: expected,
          name: 'destinationAccount',
        },
      }
      it('should save a source account state correspondingly when on chaning input', () => {
        component
          .find('.WarpContent__form__content__input__dest')
          .simulate('change', mockEvent)
        expect(component.state().formControls.destinationAccount.value).toEqual(
          expected,
        )
      })
    })

    describe('When isToEvry is false', () => {
      test('transfer function should be toStellar', () => {
        component.setProps({
          isToEvry: false,
        })
        component.find(Form).simulate('submit')
        expect(component.state().transferFunc).toEqual(mock.toStellar)
        expect(component.state().transferFunc).not.toEqual(mock.toEvry)
      })
    })

    describe('When isToEvry is true', () => {
      test('transfer function should be toEvry', () => {
        component.setProps({
          isToEvry: true,
        })
        component.find(Form).simulate('submit')
        expect(component.state().transferFunc).toEqual(mock.toEvry)
        expect(component.state().transferFunc).not.toEqual(mock.toStellar)
      })
    })

    describe('When clicking a transfer button', () => {
      it('should save a source account state correspondingly when on chaning input', () => {
        const spy = jest.spyOn(component.instance(), '_handleSubmit')
        expect(component.find(Form)).toHaveLength(1)
        component.find(Form).simulate('submit')
        expect(spy).toHaveBeenCalled()
      })
    })
  })
})

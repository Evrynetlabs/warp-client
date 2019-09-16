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
        />,
      )
    })

    it('should render correspondingly', () => {
      expect(component).toMatchSnapshot()
    })

    describe('When input an account source', () => {
      it('should save a source account state correspondingly when on changing input', () => {
        const expected = 'foo'
        const mockEvent = {
          target: {
            value: expected,
            name: 'sourceAccount',
          },
        }
        component
          .find('.WarpContent__form__content__input__src')
          .simulate('change', mockEvent)
        expect(component.state().formControls.sourceAccount.value).toEqual(
          expected,
        )
      })

      it('should get an error "Invalid Stellar secret key format."', () => {
        let mockEvent = {
          target: {
            value: 'foo',
            name: 'sourceAccount',
          },
        }

        component
          .find('.WarpContent__form__content__input__src')
          .simulate('change', mockEvent)

        expect(component.state().formControls.sourceAccount.valid).toEqual(
          false,
        )

        expect(
          component.state().formControls.sourceAccount.errorMessage,
        ).toEqual('Invalid Stellar secret key format.')
      })

      it('should get an error "Stellar secret key is required."', () => {
        let mockEvent = {
          target: {
            value: '',
            name: 'sourceAccount',
          },
        }

        component
          .find('.WarpContent__form__content__input__src')
          .simulate('change', mockEvent)

        expect(component.state().formControls.sourceAccount.valid).toEqual(
          false,
        )

        expect(
          component.state().formControls.sourceAccount.errorMessage,
        ).toEqual('Stellar secret key is required.')
      })

      it('should not get any errors', () => {
        let mockEvent = {
          target: {
            value: 'SCIMPYI2AZKATTOQOOE5LFHRHLIDSCJP2CRBHQ6ZKHVTASCXNOQQNMKE',
            name: 'sourceAccount',
          },
        }

        component
          .find('.WarpContent__form__content__input__src')
          .simulate('change', mockEvent)

        expect(component.state().formControls.sourceAccount.valid).toEqual(true)

        expect(
          component.state().formControls.sourceAccount.errorMessage,
        ).toEqual(null)
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
      it('should save a source account state correspondingly when on changing input', () => {
        component
          .find('.WarpContent__form__content__input__dest')
          .simulate('change', mockEvent)
        expect(component.state().formControls.destinationAccount.value).toEqual(
          expected,
        )
      })

      it('should get an error "Invalid Evrynet secret key format."', () => {
        let mockEvent = {
          target: {
            value: 'foo',
            name: 'destinationAccount',
          },
        }

        component
          .find('.WarpContent__form__content__input__src')
          .simulate('change', mockEvent)

        expect(component.state().formControls.destinationAccount.valid).toEqual(
          false,
        )

        expect(
          component.state().formControls.destinationAccount.errorMessage,
        ).toEqual('Invalid Evrynet secret key format.')
      })

      it('should get an error "Evrynet secret key is required."', () => {
        let mockEvent = {
          target: {
            value: '',
            name: 'destinationAccount',
          },
        }

        component
          .find('.WarpContent__form__content__input__src')
          .simulate('change', mockEvent)

        expect(component.state().formControls.destinationAccount.valid).toEqual(
          false,
        )

        expect(
          component.state().formControls.destinationAccount.errorMessage,
        ).toEqual('Evrynet secret key is required.')
      })

      it('should not get any errors', () => {
        let mockEvent = {
          target: {
            value:
              'B9CD2CCDB7CCE1EE6A2C9C21A3A7F97506666D2B02946091F2476762FA1F1039',
            name: 'destinationAccount',
          },
        }

        component
          .find('.WarpContent__form__content__input__src')
          .simulate('change', mockEvent)

        expect(component.state().formControls.destinationAccount.valid).toEqual(
          true,
        )

        expect(
          component.state().formControls.destinationAccount.errorMessage,
        ).toEqual(null)
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

      test('source account validation function should be validateEvrynetAccount', () => {
        component.setProps({
          isToEvry: false,
        })
        expect(
          component.state().formControls.sourceAccount.onChangeValidation,
        ).toEqual(component.instance()._validateEvrynetAccount)
      })

      test('destination account validation function should be validateStellarAccount', () => {
        component.setProps({
          isToEvry: false,
        })
        expect(
          component.state().formControls.destinationAccount.onChangeValidation,
        ).toEqual(component.instance()._validateStellarAccount)
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

      test('source account validation function should be validateStellarAccount', () => {
        component.setProps({
          isToEvry: true,
        })
        expect(
          component.state().formControls.sourceAccount.onChangeValidation,
        ).toEqual(component.instance()._validateStellarAccount)
      })

      test('destination account validation function should be validateEvrynetAccount', () => {
        component.setProps({
          isToEvry: true,
        })
        expect(
          component.state().formControls.destinationAccount.onChangeValidation,
        ).toEqual(component.instance()._validateEvrynetAccount)
      })
    })

    describe('When clicking a transfer button', () => {
      it('should save a source account state correspondingly when on changing input', () => {
        const spy = jest.spyOn(component.instance(), '_handleSubmit')
        expect(component.find(Form)).toHaveLength(1)
        component.find(Form).simulate('submit')
        expect(spy).toHaveBeenCalled()
      })
    })
  })
})

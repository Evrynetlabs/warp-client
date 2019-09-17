import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
jest.mock('warp-js')
import { spyGetCode } from 'warp-js'
import WarpContent from 'Components/warp/warp-content/WarpContent'
Enzyme.configure({ adapter: new Adapter() })
import { Form } from 'react-bootstrap'

describe('WarpContent', () => {
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
    toEvrynet: jest.fn(),
    whitelistedAssets: {
      state: [],
      loading: false,
      error: null,
    },
    accountBalance: {
      state: null,
      loading: false,
      error: null,
    },
    getWhitelistAssets: jest.fn(),
    isToEvry: true,
    getAccountBalance: jest.fn(),
  }
  spyGetCode.mockReturnValue('EVRY')
  let component

  beforeEach(() => {
    component = shallow(
      <WarpContent
        txHashes={mock.txHashes}
        toEvrynet={mock.toEvrynet}
        toStellar={mock.toStellar}
        whitelistedAssets={mock.whitelistedAssets}
        getWhitelistAssets={mock.getWhitelistAssets}
        isToEvry={mock.isToEvry}
        getAccountBalance={mock.getAccountBalance}
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
    it('should save a source account state correspondingly when on changing input', () => {
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

      expect(component.state().formControls.sourceAccount.valid).toEqual(false)

      expect(component.state().formControls.sourceAccount.errorMessage).toEqual(
        'Invalid Stellar secret key format.',
      )
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

      expect(component.state().formControls.sourceAccount.valid).toEqual(false)

      expect(component.state().formControls.sourceAccount.errorMessage).toEqual(
        'Stellar secret key is required.',
      )
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

      expect(component.state().formControls.sourceAccount.errorMessage).toEqual(
        null,
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
      expect(component.state().transferFunc).toEqual(mock.toStellar)
      expect(component.state().transferFunc).not.toEqual(mock.toEvrynet)
    })
  })

  describe('When isToEvry is true', () => {
    test('transfer function should be toEvrynet', () => {
      component.setProps({
        isToEvry: true,
      })
      expect(component.state().transferFunc).toEqual(mock.toEvrynet)
      expect(component.state().transferFunc).not.toEqual(mock.toStellar)
    })
  })

  describe('When input an amount', () => {
    const inputs = [
      ['0.112', '0.11'],
      ['1.0', '1'],
      ['1.01', '1.01'],
      ['1.012', '1.01'],
      ['1.112', '1.11'],
      ['10.112', '10.11'],
      ['1000.112', '1,000.11'],
      ['1.0', '1'],
    ]
    test.each(inputs)(
      'should create a correct currency string',
      (amount, expected) => {
        const mockEvent = {
          target: {
            value: amount,
            name: 'amount',
          },
        }
        const input = component.find(
          '.WarpContent__form__content__amount__input',
        )
        input.simulate('change', mockEvent)
        expect(component.state().formControls.amount.value).toEqual(amount)
        input.simulate('blur', mockEvent)
        expect(component.state().formControls.amount.value).toEqual(expected)
      },
    )
  })

  describe('When clicking a transfer button', () => {
    describe('When source accountbalance is invalid', () => {
      it('should show an invalid feedback', async () => {
        component.setProps({
          accountBalance: {
            ...component.props().accountBalance,
            state: '0',
          },
          whitelistedAssets: {
            state: [
              {
                getCode: jest.fn().mockReturnValue('EVRY'),
                decimal: 1,
              },
            ],
          },
        })
        let updatedFormControls = { ...component.state().formControls }
        updatedFormControls.amount.value = '1'
        component.setState({
          formControls: updatedFormControls,
        })
        await component.instance()._validateSubmission()
        expect(component.state().formControls.valid).toBe(false)
        await expect(component.instance()._validateAmount()).resolves.toBe(
          false,
        )
      })
      it('should match an invalid feedback snapshot', async () => {
        component.setProps({
          accountBalance: {
            ...component.props().accountBalance,
            state: '0',
          },
          whitelistedAssets: {
            state: [
              {
                getCode: jest.fn().mockReturnValue('EVRY'),
                decimal: 1,
              },
            ],
          },
        })
        let updatedFormControls = { ...component.state().formControls }
        updatedFormControls.amount.value = '1'
        component.setState({
          formControls: updatedFormControls,
        })
        const form = component.find(Form)
        await form.props().onSubmit({ preventDefault: () => {} })
        expect(component).toMatchSnapshot()
      })
    })

    describe('When source accountbalance is valid', () => {
      it('should show a valid feedback', async () => {
        component.setProps({
          accountBalance: {
            ...component.props().accountBalance,
            state: '10',
          },
          whitelistedAssets: {
            state: [
              {
                getCode: jest.fn().mockReturnValue('EVRY'),
                decimal: 1,
              },
            ],
          },
        })
        let updatedFormControls = { ...component.state().formControls }
        updatedFormControls.amount.value = '1'
        component.setState({
          formControls: updatedFormControls,
        })
        await component.instance()._validateSubmission()
        expect(component.state().formControls.valid).toBe(true)
        await expect(component.instance()._validateAmount()).resolves.toBe(true)
      })
      it('should match a valid feedback snapshot', async () => {
        component.setProps({
          accountBalance: {
            ...component.props().accountBalance,
            state: '10',
          },
          whitelistedAssets: {
            state: [
              {
                getCode: jest.fn().mockReturnValue('EVRY'),
                decimal: 1,
              },
            ],
          },
        })
        let updatedFormControls = { ...component.state().formControls }
        updatedFormControls.amount.value = '1'
        component.setState({
          formControls: updatedFormControls,
        })
        const form = component.find(Form)
        await form.props().onSubmit({ preventDefault: () => {} })
        expect(component).toMatchSnapshot()
      })
    })
  })
})

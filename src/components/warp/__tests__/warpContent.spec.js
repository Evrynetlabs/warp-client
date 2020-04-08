import React from 'react'
import { shallow } from 'enzyme'
import StellarBase from 'stellar-base'
import {
  spyGetCode,
  warpConfigInstance,
  spyToStellarFormat,
} from '@Evrynetlabs/warp-js'
import WarpContent from 'Components/warp/warp-content/WarpContent'
import BigNumber from 'bignumber.js'

describe('WarpContent', () => {
  const mock = {
    txHashes: {
      state: {
        stellar: 'foo',
        evrynet: 'bar',
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
    trustlines: {
      state: [],
      loading: false,
      error: null,
    },
    getWhitelistAssets: jest.fn(),
    isToEvrynet: true,
    getAccountBalance: jest.fn(),
    getTrustlines: jest.fn(),
    push: jest.fn(),
    startLoading: jest.fn(),
    stopLoading: jest.fn(),
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
        isToEvrynet={mock.isToEvrynet}
        getAccountBalance={mock.getAccountBalance}
        accountBalance={mock.accountBalance}
        getTrustlines={mock.getTrustlines}
        trustlines={mock.trustlines}
        push={mock.push}
        startLoading={mock.startLoading}
        stopLoading={mock.stopLoading}
      ></WarpContent>,
    )
  })

  it('should render correspondingly', () => {
    expect(component).toMatchSnapshot()
  })

  describe('When input an account', () => {
    test.each([
      [
        {
          value: 'foo',
          name: 'sourceAccount',
        },
        {
          valid: false,
          message: 'Invalid Stellar secret key format.',
        },
      ],
      [
        {
          value: '',
          name: 'sourceAccount',
        },
        {
          valid: false,
          message: 'Stellar secret key is required.',
        },
      ],
      [
        {
          value: 'SCIMPYI2AZKATTOQOOE5LFHRHLIDSCJP2CRBHQ6ZKHVTASCXNOQQNMKE',
          name: 'sourceAccount',
        },
        {
          valid: true,
          message: null,
        },
      ],
      [
        {
          value: 'foo',
          name: 'destinationAccount',
        },
        {
          valid: false,
          message: 'Invalid Evrynet secret key format.',
        },
      ],
      [
        {
          value: '',
          name: 'destinationAccount',
        },
        {
          valid: false,
          message: 'Evrynet secret key is required.',
        },
      ],
      [
        {
          value:
            'B9CD2CCDB7CCE1EE6A2C9C21A3A7F97506666D2B02946091F2476762FA1F1039',
          name: 'destinationAccount',
        },
        {
          valid: true,
          message: null,
        },
      ],
    ])('should get a correct expectation', async (args, expected) => {
      await component.instance()._changeHandler(args)
      await component.update()

      expect(component.state().formControls[args.name].valid).toEqual(
        expected.valid,
      )

      expect(component.state().formControls[args.name].errorMessage).toEqual(
        expected.message,
      )
    })
  })

  describe('When input an amount', () => {
    const inputs = [
      ['0.112', '0.112'],
      ['1.0', '1.0'],
      ['1.01', '1.01'],
      ['1.012', '1.012'],
      ['1.112', '1.112'],
      ['10.112', '10.112'],
      ['1000.112', '1000.112'],
      ['1.0', '1.0'],
      ['0001.0', '1.0'],
      ['-1', '-1'],
      ['1.', '1'],
      ['001.', '1'],
      ['1.....', '1.....'],
    ]
    test.each(inputs)(
      'should create a correct currency string',
      async (amount, expected) => {
        const mockEvent = {
          target: {
            value: amount,
            name: 'amount',
          },
        }
        const mockWhitelistedAsset = {
          getCode: jest.fn().mockReturnValue('EVRY'),
          decimal: 18,
          getDecimal: jest.fn().mockReturnValue(18),
        }
        component.setProps({
          whitelistedAssets: {
            state: [mockWhitelistedAsset],
          },
        })
        await component.instance()._changeHandler(mockEvent.target)
        await component.update()

        expect(component.state().formControls.amount.value).toEqual(amount)
        await component.instance()._blurHandler(mockEvent.target)
        await component.update()

        expect(component.state().formControls.amount.value).toEqual(expected)
      },
    )

    describe('When input an invalid amount', () => {
      describe('When amount is zero', () => {
        it('should save an invalid state with a desired error message', async () => {
          const mockEvent = {
            target: {
              value: '0',
              name: 'amount',
            },
          }
          await component.instance()._changeHandler(mockEvent.target)
          await component.update()
          expect(component.state().formControls.amount.valid).toEqual(false)
          expect(component.state().formControls.amount.errorMessage).toEqual(
            'Amount must be greater than zero.',
          )
          expect(component).toMatchSnapshot()
        })
      })

      describe('When amount is less than zero', () => {
        test.each(['-1', '-0.01', '-1.2222', '0', '0.000'])(
          'should save an invalid state with a desired error message',
          async (ech) => {
            const mockEvent = {
              target: {
                value: ech,
                name: 'amount',
              },
            }
            await component.instance()._changeHandler(mockEvent.target)
            await component.update()

            expect(component.state().formControls.amount.valid).toEqual(false)
            expect(component.state().formControls.amount.errorMessage).toEqual(
              'Amount must be greater than zero.',
            )
            expect(component).toMatchSnapshot()
          },
        )
      })

      describe('When amount precision exceeds limit decimal', () => {
        test.each([['1.000', 2], ['1.00000000', 7]])(
          'should save an invalid state with a desired error message',
          async (ech, decimal) => {
            const mockEvent = {
              target: {
                value: ech,
                name: 'amount',
              },
            }
            const mockWhitelistedAsset = {
              getCode: jest.fn().mockReturnValue('EVRY'),
              decimal,
              getDecimal: jest.fn().mockReturnValue(decimal),
            }
            component.setProps({
              whitelistedAssets: {
                state: [mockWhitelistedAsset],
              },
            })
            await component.instance()._changeHandler(mockEvent.target)
            await component.update()

            expect(component.state().formControls.amount.valid).toEqual(false)
            expect(component.state().formControls.amount.errorMessage).toEqual(
              `Amount can only support a precision of ${mockWhitelistedAsset.decimal} decimals.`,
            )
            expect(component).toMatchSnapshot()
          },
        )
      })

      describe('When amount is empty', () => {
        it('should display an invalid feedback', async () => {
          const mockEvent = {
            target: {
              value: '',
              name: 'amount',
            },
          }
          const mockWhitelistedAsset = {
            getCode: jest.fn().mockReturnValue('EVRY'),
            decimal: 2,
            getDecimal: jest.fn().mockReturnValue(2),
          }
          component.setProps({
            whitelistedAssets: {
              state: [mockWhitelistedAsset],
            },
          })
          await component.instance()._changeHandler(mockEvent.target)
          await component.update()

          expect(component.state().formControls.amount.valid).toEqual(false)
          expect(component.state().formControls.amount.errorMessage).toEqual(
            'Amount is required.',
          )
          expect(component).toMatchSnapshot()
        })
      })

      describe('When amount is not a number', () => {
        test.each(['--1.000', '1.00--0000000', 'foo', 'bar', '-.', '0.--1'])(
          'should save an invalid state with a desired error message',
          async (ech) => {
            const mockEvent = {
              target: {
                value: ech,
                name: 'amount',
              },
            }
            const mockWhitelistedAsset = {
              getCode: jest.fn().mockReturnValue('EVRY'),
              decimal: 2,
              getDecimal: jest.fn().mockReturnValue(2),
            }
            component.setProps({
              whitelistedAssets: {
                state: [mockWhitelistedAsset],
              },
            })
            await component.instance()._changeHandler(mockEvent.target)
            await component.update()

            expect(component.state().formControls.amount.valid).toEqual(false)
            expect(component.state().formControls.amount.errorMessage).toEqual(
              'Amount must be a number.',
            )
            expect(component).toMatchSnapshot()
          },
        )
      })
    })
  })

  describe('When clicking a transfer button', () => {
    const mockEvent = {
      target: {
        name: 'form',
      },
    }
    test('transfer function should be toStellar', () => {
      component.setProps({
        isToEvrynet: false,
      })
      expect(component.state().transferFunc).toEqual(mock.toStellar)
      expect(component.state().transferFunc).not.toEqual(mock.toEvrynet)
    })
    test('transfer function should be toEvrynet', () => {
      expect(component.state().transferFunc).toEqual(mock.toEvrynet)
      expect(component.state().transferFunc).not.toEqual(mock.toStellar)
    })
    test.each([
      [
        {
          isToEvrynet: false,
          minimumBalance: 0,
          accountBalanceState: new BigNumber('0'),
          creditOriginValue: 2,
          issuerValue:
            'GD3LCO22AM4NUGJ3GBKISNL4LDRZN44YTZAUDXBUKA6UG67B2RGWNQOQ',
          codeValue: 'foo1',
          decimalValue: 1,
          amountValue: '1',
          trustlines: [
            {
              code: 'foo1',
              issuer:
                'GD3LCO22AM4NUGJ3GBKISNL4LDRZN44YTZAUDXBUKA6UG67B2RGWNQOQ',
            },
          ],
        },
        {
          valid: false,
          input: 'amount',
        },
      ],
      [
        {
          isToEvrynet: false,
          minimumBalance: 0,
          accountBalanceState: new BigNumber('1').shiftedBy(18),
          creditOriginValue: 1,
          issuerValue:
            'GD3LCO22AM4NUGJ3GBKISNL4LDRZN44YTZAUDXBUKA6UG67B2RGWNQOQ',
          codeValue: 'foo1',
          decimalValue: warpConfigInstance.evrynet.atomicEvryDecimalUnit,
          amountValue: '1',
          trustlines: [
            {
              code: 'foo1',
              issuer:
                'GD3LCO22AM4NUGJ3GBKISNL4LDRZN44YTZAUDXBUKA6UG67B2RGWNQOQ',
            },
          ],
        },
        {
          valid: true,
          input: 'amount',
        },
      ],
      [
        {
          isToEvrynet: false,
          minimumBalance: 0,
          accountBalanceState: new BigNumber('1').shiftedBy(1),
          creditOriginValue: 2,
          issuerValue:
            'GD3LCO22AM4NUGJ3GBKISNL4LDRZN44YTZAUDXBUKA6UG67B2RGWNQOQ',
          codeValue: 'foo1',
          decimalValue: 1,
          amountValue: '1',
          trustlines: [
            {
              code: 'foo1',
              issuer:
                'GD3LCO22AM4NUGJ3GBKISNL4LDRZN44YTZAUDXBUKA6UG67B2RGWNQOQ',
            },
          ],
        },
        {
          valid: true,
          input: 'amount',
        },
      ],
      [
        {
          isToEvrynet: false,
          minimumBalance: 15000000,
          accountBalanceState: new BigNumber('1').shiftedBy(1),
          creditOriginValue: 2,
          issuerValue:
            'GD3LCO22AM4NUGJ3GBKISNL4LDRZN44YTZAUDXBUKA6UG67B2RGWNQOQ',
          codeValue: 'foo1',
          decimalValue: 1,
          amountValue: '1',
          trustlines: [{ code: 'foo', issuer: 'bar' }],
        },
        {
          valid: false,
          input: 'destinationAccount',
        },
      ],
      [
        {
          isToEvrynet: false,
          minimumBalance: 15000000,
          accountBalanceState: new BigNumber('1').shiftedBy(1),
          creditOriginValue: 2,
          issuerValue:
            'GD3LCO22AM4NUGJ3GBKISNL4LDRZN44YTZAUDXBUKA6UG67B2RGWNQOQ',
          codeValue: 'foo1',
          decimalValue: 1,
          amountValue: '1',
          trustlines: [],
        },
        {
          valid: false,
          input: 'destinationAccount',
        },
      ],
      [
        {
          isToEvrynet: true,
          minimumBalance: 0,
          accountBalanceState: new BigNumber('0'),
          creditOriginValue: 2,
          issuerValue:
            'GD3LCO22AM4NUGJ3GBKISNL4LDRZN44YTZAUDXBUKA6UG67B2RGWNQOQ',
          codeValue: 'foo1',
          decimalValue: 1,
          amountValue: '1',
          trustlines: [],
        },
        {
          input: 'amount',
          valid: false,
        },
      ],
      [
        {
          isToEvrynet: true,
          minimumBalance: 0,
          accountBalanceState: new BigNumber('1').shiftedBy(
            warpConfigInstance.evrynet.atomicStellarDecimalUnit,
          ),
          creditOriginValue: 1,
          issuerValue:
            'GD3LCO22AM4NUGJ3GBKISNL4LDRZN44YTZAUDXBUKA6UG67B2RGWNQOQ',
          codeValue: 'foo1',
          decimalValue: warpConfigInstance.evrynet.atomicStellarDecimalUnit,
          amountValue: '1',
          trustlines: [],
        },
        {
          input: 'amount',
          valid: true,
        },
      ],
      [
        {
          isToEvrynet: true,
          minimumBalance: 10000000,
          accountBalanceState: new BigNumber('1').shiftedBy(
            warpConfigInstance.evrynet.atomicStellarDecimalUnit,
          ),
          creditOriginValue: 1,
          issuerValue:
            'GD3LCO22AM4NUGJ3GBKISNL4LDRZN44YTZAUDXBUKA6UG67B2RGWNQOQ',
          codeValue: 'foo1',
          decimalValue: warpConfigInstance.evrynet.atomicStellarDecimalUnit,
          amountValue: '1',
          trustlines: [],
        },
        {
          input: 'amount',
          valid: true,
        },
      ],
      [
        {
          isToEvrynet: true,
          minimumBalance: 15000000,
          accountBalanceState: new BigNumber('1').shiftedBy(
            warpConfigInstance.evrynet.atomicStellarDecimalUnit,
          ),
          creditOriginValue: 1,
          issuerValue:
            'GD3LCO22AM4NUGJ3GBKISNL4LDRZN44YTZAUDXBUKA6UG67B2RGWNQOQ',
          codeValue: 'foo1',
          decimalValue: warpConfigInstance.evrynet.atomicStellarDecimalUnit,
          amountValue: '1',
          trustlines: [
            [
              {
                code: 'foo1',
                issuer:
                  'GD3LCO22AM4NUGJ3GBKISNL4LDRZN44YTZAUDXBUKA6UG67B2RGWNQOQ',
              },
            ],
          ],
        },
        {
          input: 'amount',
          valid: true,
        },
      ],
      [
        {
          isToEvrynet: true,
          minimumBalance: 15000000,
          accountBalanceState: new BigNumber('1').shiftedBy(
            warpConfigInstance.evrynet.atomicStellarDecimalUnit,
          ),
          creditOriginValue: 1,
          issuerValue: '',
          codeValue: 'xlm',
          decimalValue: warpConfigInstance.evrynet.atomicStellarDecimalUnit,
          amountValue: '1',
          trustlines: [
            [
              {
                code: 'xlm',
                issuer: '',
              },
            ],
          ],
        },
        {
          input: 'amount',
          valid: true,
        },
      ],
      [
        {
          isToEvrynet: true,
          minimumBalance: 10000000,
          accountBalanceState: new BigNumber('1').shiftedBy(
            warpConfigInstance.evrynet.atomicStellarDecimalUnit,
          ),
          creditOriginValue: 1,
          issuerValue: '',
          codeValue: 'xlm',
          decimalValue: warpConfigInstance.evrynet.atomicStellarDecimalUnit,
          amountValue: '1',
          trustlines: [],
        },
        {
          input: 'amount',
          valid: true,
        },
      ],
      [
        {
          isToEvrynet: true,
          minimumBalance: 0,
          accountBalanceState: new BigNumber('1').shiftedBy(
            warpConfigInstance.evrynet.atomicStellarDecimalUnit,
          ),
          creditOriginValue: 1,
          issuerValue: '',
          codeValue: 'xlm',
          decimalValue: warpConfigInstance.evrynet.atomicStellarDecimalUnit,
          amountValue: '1',
          trustlines: [],
        },
        {
          input: 'amount',
          valid: false,
        },
      ],
      [
        {
          isToEvrynet: true,
          minimumBalance: 14000000,
          accountBalanceState: new BigNumber('1').shiftedBy(
            warpConfigInstance.evrynet.atomicStellarDecimalUnit,
          ),
          creditOriginValue: 1,
          issuerValue: '',
          codeValue: 'xlm',
          decimalValue: warpConfigInstance.evrynet.atomicStellarDecimalUnit,
          amountValue: '1',
          trustlines: [
            [
              {
                code: 'xlm',
                issuer: '',
              },
            ],
          ],
        },
        {
          input: 'amount',
          valid: false,
        },
      ],
    ])('calling _onsubmit function', async (fields, expected) => {
      const whitelistedAsset = {
        getCode: jest.fn().mockReturnValue(fields.codeValue),
        getDecimal: jest.fn().mockReturnValue(fields.decimalValue),
        getCreditOrigin: jest.fn().mockReturnValue(fields.creditOriginValue),
        getIssuer: jest.fn().mockReturnValue(fields.issuerValue),
        code: fields.codeValue,
        issuer: fields.issuerValue,
        decimal: fields.decimalValue,
        creditOrigin: fields.creditOriginValue,
        toStellarFormat: jest.fn().mockImplementation(() => {
          return new StellarBase.Asset(fields.codeValue, fields.issuerValue)
        }),
      }
      component.setProps({
        isToEvrynet: fields.isToEvrynet,
        trustlines: {
          ...component.props().trustlines,
          state: fields.trustlines,
        },
        accountBalance: {
          ...component.props().accountBalance,
          state: fields.accountBalanceState
            .plus(fields.minimumBalance)
            .toString(),
        },
        whitelistedAssets: {
          state: [whitelistedAsset],
        },
      })
      component.instance()._getWhitelistedAssetByCode = jest
        .fn()
        .mockReturnValue(whitelistedAsset)
      await component.update()
      let updatedFormControls = { ...component.state().formControls }
      updatedFormControls.amount.value = fields.amountValue
      component.setState({
        formControls: updatedFormControls,
      })
      await component.update()
      await component.instance()._onSubmit(mockEvent.target)
      await component.update()
      expect(component.state().formControls[expected.input].valid).toBe(
        expected.valid,
      )
      expect(component).toMatchSnapshot()
    })

    describe('When toggle a disable submission form', () => {
      it('should set a deterministic state', () => {
        component.instance()._disableButton(true)
        component.update()
        expect(component.state().formControls.form.disabled).toBe(true)
        component.instance()._disableButton(false)
        component.update()
        expect(component.state().formControls.form.disabled).toBe(false)
      })
    })
  })
})

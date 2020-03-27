import React from 'react'
import { shallow } from 'enzyme'
import { spyGetCode } from '@Evrynetlabs/warp-js'
import WarpContent from 'Components/warp/warp-content/WarpContent'

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

  describe('When input an account source', () => {
    const expected = 'foo'
    const mockEvent = {
      target: {
        value: expected,
        name: 'sourceAccount',
      },
    }
    it('should save a source account state correspondingly when on changing input', async () => {
      await component
        .find('.WarpContent__form__content__input__src')
        .simulate('change', mockEvent)
      await component.update()
      expect(component.state().formControls.sourceAccount.value).toEqual(
        expected,
      )
    })
    it('should get an error "Invalid Stellar secret key format."', async () => {
      let mockEvent = {
        target: {
          value: 'foo',
          name: 'sourceAccount',
        },
      }

      await component
        .find('.WarpContent__form__content__input__src')
        .simulate('change', mockEvent)
      await component.update()

      expect(component.state().formControls.sourceAccount.valid).toEqual(false)

      expect(component.state().formControls.sourceAccount.errorMessage).toEqual(
        'Invalid Stellar secret key format.',
      )
    })

    it('should get an error "Stellar secret key is required."', async () => {
      let mockEvent = {
        target: {
          value: '',
          name: 'sourceAccount',
        },
      }

      await component
        .find('.WarpContent__form__content__input__src')
        .simulate('change', mockEvent)
      await component.update()

      expect(component.state().formControls.sourceAccount.valid).toEqual(false)

      expect(component.state().formControls.sourceAccount.errorMessage).toEqual(
        'Stellar secret key is required.',
      )
    })

    it('should not get any errors', async () => {
      let mockEvent = {
        target: {
          value: 'SCIMPYI2AZKATTOQOOE5LFHRHLIDSCJP2CRBHQ6ZKHVTASCXNOQQNMKE',
          name: 'sourceAccount',
        },
      }

      await component
        .find('.WarpContent__form__content__input__src')
        .simulate('change', mockEvent)
      await component.update()

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
    it('should save a source account state correspondingly when on chaning input', async () => {
      await component
        .find('.WarpContent__form__content__input__dest')
        .simulate('change', mockEvent)
      await component.update()

      expect(component.state().formControls.destinationAccount.value).toEqual(
        expected,
      )
    })
    it('should get an error "Invalid Evrynet secret key format."', async () => {
      let mockEvent = {
        target: {
          value: 'foo',
          name: 'destinationAccount',
        },
      }

      await component
        .find('.WarpContent__form__content__input__src')
        .simulate('change', mockEvent)
      await component.update()

      expect(component.state().formControls.destinationAccount.valid).toEqual(
        false,
      )

      expect(
        component.state().formControls.destinationAccount.errorMessage,
      ).toEqual('Invalid Evrynet secret key format.')
    })

    it('should get an error "Evrynet secret key is required."', async () => {
      let mockEvent = {
        target: {
          value: '',
          name: 'destinationAccount',
        },
      }

      await component
        .find('.WarpContent__form__content__input__src')
        .simulate('change', mockEvent)
      await component.update()

      expect(component.state().formControls.destinationAccount.valid).toEqual(
        false,
      )

      expect(
        component.state().formControls.destinationAccount.errorMessage,
      ).toEqual('Evrynet secret key is required.')
    })

    it('should not get any errors', async () => {
      let mockEvent = {
        target: {
          value:
            'B9CD2CCDB7CCE1EE6A2C9C21A3A7F97506666D2B02946091F2476762FA1F1039',
          name: 'destinationAccount',
        },
      }

      await component
        .find('.WarpContent__form__content__input__src')
        .simulate('change', mockEvent)
      await component.update()

      expect(component.state().formControls.destinationAccount.valid).toEqual(
        true,
      )

      expect(
        component.state().formControls.destinationAccount.errorMessage,
      ).toEqual(null)
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
        const input = component.find(
          '.WarpContent__form__content__input__amount',
        )
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
        await input.simulate('change', mockEvent)
        await component.update()

        expect(component.state().formControls.amount.value).toEqual(amount)
        await input.simulate('blur', mockEvent)
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
          const input = component.find(
            '.WarpContent__form__content__input__amount',
          )
          await input.simulate('change', mockEvent)
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
            const input = component.find(
              '.WarpContent__form__content__input__amount',
            )
            await input.simulate('change', mockEvent)
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
            const input = component.find(
              '.WarpContent__form__content__input__amount',
            )
            await input.simulate('change', mockEvent)
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
          const input = component.find(
            '.WarpContent__form__content__input__amount',
          )
          await input.simulate('change', mockEvent)
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
            const input = component.find(
              '.WarpContent__form__content__input__amount',
            )
            await input.simulate('change', mockEvent)
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
    describe('When isToEvrynet is false', () => {
      test('transfer function should be toStellar', () => {
        component.setProps({
          isToEvrynet: false,
        })
        expect(component.state().transferFunc).toEqual(mock.toStellar)
        expect(component.state().transferFunc).not.toEqual(mock.toEvrynet)
      })
      describe('When source account balance is invalid', () => {
        it('should show an invalid feedback', async () => {
          component.setProps({
            isToEvrynet: false,
            accountBalance: {
              ...component.props().accountBalance,
              state: '0',
            },
            whitelistedAssets: {
              state: [
                {
                  getCode: jest.fn().mockReturnValue('EVRY'),
                  decimal: 1,
                  getDecimal: jest.fn().mockReturnValue(1),
                },
              ],
            },
          })
          let updatedFormControls = { ...component.state().formControls }
          updatedFormControls.amount.value = '1'
          component.setState({
            formControls: updatedFormControls,
          })
          await component.update()
          await component.instance()._onSubmit(mockEvent.target)
          expect(component.state().formControls.amount.valid).toBe(false)
          expect(component.state().formControls.amount.errorMessage).toBe(
            'Insufficient Amount',
          )
        })
        it('should match an invalid feedback snapshot', async () => {
          component.setProps({
            isToEvrynet: false,
            accountBalance: {
              ...component.props().accountBalance,
              state: '0',
            },
            whitelistedAssets: {
              state: [
                {
                  getCode: jest.fn().mockReturnValue('EVRY'),
                  decimal: 1,
                  getDecimal: jest.fn().mockReturnValue(1),
                },
              ],
            },
          })
          let updatedFormControls = { ...component.state().formControls }
          updatedFormControls.amount.value = '1'
          component.setState({
            formControls: updatedFormControls,
          })
          await component.update()
          await component.instance()._onSubmit(mockEvent.target)

          expect(component).toMatchSnapshot()
        })
      })

      describe('When source account balance is valid', () => {
        it('should show a valid feedback', async () => {
          component.setProps({
            isToEvrynet: false,
            accountBalance: {
              ...component.props().accountBalance,
              state: '10',
            },
            whitelistedAssets: {
              state: [
                {
                  getCode: jest.fn().mockReturnValue('EVRY'),
                  decimal: 1,
                  getDecimal: jest.fn().mockReturnValue(1),
                },
              ],
            },
          })
          let updatedFormControls = { ...component.state().formControls }
          updatedFormControls.amount.value = '1'
          component.setState({
            formControls: updatedFormControls,
          })
          await component.update()
          await component.instance()._onSubmit(mockEvent.target)
          expect(component.state().formControls.amount.valid).toBe(true)
          expect(component.state().formControls.amount.errorMessage).toBe(null)
        })
        it('should match a valid feedback snapshot', async () => {
          component.setProps({
            isToEvrynet: false,
            accountBalance: {
              ...component.props().accountBalance,
              state: '10',
            },
            whitelistedAssets: {
              state: [
                {
                  getCode: jest.fn().mockReturnValue('EVRY'),
                  decimal: 1,
                  getDecimal: jest.fn().mockReturnValue(1),
                },
              ],
            },
          })
          let updatedFormControls = { ...component.state().formControls }
          updatedFormControls.amount.value = '1'
          component.setState({
            formControls: updatedFormControls,
          })
          await component.update()
          await component.instance()._onSubmit(mockEvent.target)

          expect(component).toMatchSnapshot()
        })
      })

      describe('When asset is not in the destination account trustlines', () => {
        it('should show an invalid feedback', async () => {
          component.setProps({
            isToEvrynet: false,
            trustlines: {
              ...component.props().trustlines,
              state: [
                { code: 'foo1', issuer: 'bar1' },
                { code: 'foo2', issuer: 'bar2' },
              ],
            },
            whitelistedAssets: {
              state: [
                {
                  getCode: jest.fn().mockReturnValue('foo'),
                  decimal: 1,
                  getDecimal: jest.fn().mockReturnValue(1),
                },
              ],
            },
          })
          component.instance()._getWhitelistedAssetByCode = jest.fn()
          component.instance()._getWhitelistedAssetByCode.mockReturnValue({
            code: 'foo',
            issuer: 'bar',
            getDecimal: () => 1,
          })
          await component.update()
          await component.instance()._onSubmit(mockEvent.target)

          expect(component.state().formControls.destinationAccount.valid).toBe(
            false,
          )
          expect(
            component.state().formControls.destinationAccount.errorMessage,
          ).toBe('The recipient Stellar account has no foo trustline.')

          expect(component).toMatchSnapshot()
        })
      })

      describe('When asset is in the destination account trustlines', () => {
        it('should show a valid feedback', async () => {
          component.setProps({
            isToEvrynet: false,
            trustlines: {
              ...component.props().trustlines,
              state: [
                { code: 'foo1', issuer: 'bar1' },
                { code: 'foo2', issuer: 'bar2' },
              ],
            },
            whitelistedAssets: {
              state: [
                {
                  getCode: jest.fn().mockReturnValue('foo1'),
                  decimal: 1,
                  getDecimal: jest.fn().mockReturnValue(1),
                },
              ],
            },
          })
          component.instance()._getWhitelistedAssetByCode = jest.fn()
          component.instance()._getWhitelistedAssetByCode.mockReturnValue({
            code: 'foo1',
            issuer: 'bar1',
            getDecimal: () => 1,
          })
          await component.update()
          await component.instance()._onSubmit(mockEvent.target)

          expect(component.state().formControls.destinationAccount.valid).toBe(
            true,
          )
          expect(
            component.state().formControls.destinationAccount.errorMessage,
          ).toBe(null)
          expect(component).toMatchSnapshot()
        })
      })
    })

    describe('When isToEvrynet is true', () => {
      test('transfer function should be toEvrynet', () => {
        expect(component.state().transferFunc).toEqual(mock.toEvrynet)
        expect(component.state().transferFunc).not.toEqual(mock.toStellar)
      })
      describe('When source account balance is invalid', () => {
        it('should show an invalid feedback', async () => {
          component.setProps({
            isToEvrynet: true,
            accountBalance: {
              ...component.props().accountBalance,
              state: '0',
            },
            whitelistedAssets: {
              state: [
                {
                  getCode: jest.fn().mockReturnValue('EVRY'),
                  decimal: 1,
                  getDecimal: jest.fn().mockReturnValue(1),
                },
              ],
            },
          })
          let updatedFormControls = { ...component.state().formControls }
          updatedFormControls.amount.value = '1'
          component.setState({
            formControls: updatedFormControls,
          })
          await component.update()
          await component.instance()._onSubmit(mockEvent.target)

          expect(component.state().formControls.amount.valid).toBe(false)
        })
        it('should match an invalid feedback snapshot', async () => {
          component.setProps({
            isToEvrynet: true,
            accountBalance: {
              ...component.props().accountBalance,
              state: '0',
            },
            whitelistedAssets: {
              state: [
                {
                  getCode: jest.fn().mockReturnValue('EVRY'),
                  decimal: 1,
                  getDecimal: jest.fn().mockReturnValue(1),
                },
              ],
            },
          })
          let updatedFormControls = { ...component.state().formControls }
          updatedFormControls.amount.value = '1'
          component.setState({
            formControls: updatedFormControls,
          })
          await component.update()
          await component.instance()._onSubmit(mockEvent.target)

          expect(component).toMatchSnapshot()
        })
      })

      describe('When source account balance is valid', () => {
        it('should show a valid feedback', async () => {
          component.setProps({
            isToEvrynet: true,
            accountBalance: {
              ...component.props().accountBalance,
              state: '10000000',
            },
            whitelistedAssets: {
              state: [
                {
                  getCode: jest.fn().mockReturnValue('EVRY'),
                  decimal: 1,
                  getDecimal: jest.fn().mockReturnValue(1),
                },
              ],
            },
          })
          let updatedFormControls = { ...component.state().formControls }
          updatedFormControls.amount.value = '1'
          component.setState({
            formControls: updatedFormControls,
          })
          await component.update()
          await component.instance()._onSubmit(mockEvent.target)

          expect(component.state().formControls.amount.valid).toBe(true)
          expect(component.state().formControls.amount.errorMessage).toBe(null)
        })
        it('should match a valid feedback snapshot', async () => {
          component.setProps({
            isToEvrynet: true,
            accountBalance: {
              ...component.props().accountBalance,
              state: '10000000',
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
          await component.update()
          await component.instance()._onSubmit(mockEvent.target)

          expect(component).toMatchSnapshot()
        })
      })
    })
  })

  describe('When toggle a disable submission form', () => {
    it('should set a deterministic state', () => {
      component.instance()._toggleDisableSubmissionBtn()
      component.update()
      expect(component.state().formControls.form.disabled).toBe(true)
      component.instance()._toggleDisableSubmissionBtn()
      component.update()
      expect(component.state().formControls.form.disabled).toBe(false)
    })
  })
})

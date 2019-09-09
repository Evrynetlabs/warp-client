import { numberToCurrencyString, currencyToNumberString } from '@/utils/format'

describe('numberToCurrencyString', () => {
  test.each([
    [0.112, undefined, '0.11'],
    [1.0, undefined, '1.00'],
    [1.01, undefined, '1.01'],
    [1.012, undefined, '1.01'],
    [1.112, undefined, '1.11'],
    [10.112, undefined, '10.11'],
    [1000.112, undefined, '1,000.11'],
    [1.0, 4, '1.00'],
    [1.01, 4, '1.01'],
    [1.0111, 4, '1.0111'],
    [10.0111, 4, '10.0111'],
    [1000.0111, 4, '1,000.0111'],
    [1000.1111, 4, '1,000.1111'],
  ])(
    'should create a correct currency string',
    (amount, decimals, expected) => {
      expect(numberToCurrencyString(amount, decimals)).toBe(expected)
    },
  )
})

describe('currencyToNumberString', () => {
  test.each([
    ['1,000', '1000'],
    ['10,000,000', '10000000'],
    ['10,000,000.0122', '10000000.0122'],
  ])('should create a correct number string', (currencyStr, expected) => {
    expect(currencyToNumberString(currencyStr)).toBe(expected)
  })
})

import { numberToMoneyString, moneyToNumberString } from '@/utils/format'

describe('numberToMoneyString', () => {
  test.each([
    [0.112, undefined, '0.11'],
    [1.0, undefined, '1'],
    [1.01, undefined, '1.01'],
    [1.012, undefined, '1.01'],
    [1.112, undefined, '1.11'],
    [10.112, undefined, '10.11'],
    [1000.112, undefined, '1,000.11'],
    [10000000000, undefined, '10,000,000,000'],
    [1.0, 4, '1'],
    [1.01, 4, '1.01'],
    [1.0111, 4, '1.0111'],
    [10.0111, 4, '10.0111'],
    [1000.0111, 4, '1,000.0111'],
    [1000.1111, 4, '1,000.1111'],
  ])(
    'should create a correct currency string',
    (amount, decimals, expected) => {
      expect(numberToMoneyString(amount, decimals)).toBe(expected)
    },
  )
})

describe('moneyToNumberString', () => {
  test.each([
    ['1,000', '1000'],
    ['10,000,000', '10000000'],
    ['10,000,000.0122', '10000000.0122'],
  ])('should create a correct number string', (currencyStr, expected) => {
    expect(moneyToNumberString(currencyStr)).toBe(expected)
  })
})

import { numberToMoneyString, moneyToNumberString } from '@/utils/format'

describe('numberToMoneyString', () => {
  test.each([
    [0.112, '0.112'],
    [1.0, '1'],
    [1.01, '1.01'],
    [1.012, '1.012'],
    [1.112, '1.112'],
    [10.112, '10.112'],
    [1000.112, '1,000.112'],
    [10000000000, '10,000,000,000'],
    [10000000000.0, '10,000,000,000'],
  ])('should create a correct currency string', (amount, expected) => {
    expect(numberToMoneyString(amount)).toBe(expected)
  })
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

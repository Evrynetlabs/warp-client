import { numberToCurrencyString, currencyToNumberString } from '@/utils/format'

describe('numberToCurrencyString', () => {
  it('should create a correct currency string', () => {
    expect(numberToCurrencyString(0.112)).toBe('0.11')
    expect(numberToCurrencyString(1.0)).toBe('1.00')
    expect(numberToCurrencyString(1.01)).toBe('1.01')
    expect(numberToCurrencyString(1.012)).toBe('1.01')
    expect(numberToCurrencyString(1.112)).toBe('1.11')
    expect(numberToCurrencyString(10.112)).toBe('10.11')
    expect(numberToCurrencyString(1000.112)).toBe('1,000.11')
    expect(numberToCurrencyString(1.0, 4)).toBe('1.00')
    expect(numberToCurrencyString(1.01, 4)).toBe('1.01')
    expect(numberToCurrencyString(1.0111, 4)).toBe('1.0111')
    expect(numberToCurrencyString(1.0111, 4)).toBe('1.0111')
    expect(numberToCurrencyString(10.0111, 4)).toBe('10.0111')
    expect(numberToCurrencyString(1000.0111, 4)).toBe('1,000.0111')
    expect(numberToCurrencyString(1000.1111, 4)).toBe('1,000.1111')
  })
})

describe('currencyToNumberString', () => {
  it('should create a correct number string', () => {
    expect(currencyToNumberString('1,000')).toBe('1000')
    expect(currencyToNumberString('10,000,000')).toBe('10000000')
    expect(currencyToNumberString('10,000,000.0122')).toBe('10000000.0122')
  })
})

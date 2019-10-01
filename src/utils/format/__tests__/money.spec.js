import {
  cleanNonNumber,
  removeLeadingZero,
  removeTrailingDot,
  toCurrency,
} from '@/utils/format'

describe('formatNumber', () => {
  test.each([
    ['1,000', '1000'],
    ['10,000,000', '10000000'],
    ['10,000,000.0122', '10000000.0122'],
  ])('should create a correct number string', (ech, expected) => {
    expect(cleanNonNumber(ech)).toBe(expected)
  })
})

describe('removeLeadingZero', () => {
  test.each([['00001', '1'], ['0.1', '0.1']])(
    'should create a correct number string',
    (ech, expected) => {
      expect(removeLeadingZero(ech)).toBe(expected)
    },
  )
})

describe('removeTrailingDot', () => {
  test.each([['00001.', '00001'], ['1.', '1']])(
    'should create a correct number string',
    (ech, expected) => {
      expect(removeTrailingDot(ech)).toBe(expected)
    },
  )
})

describe('toCurrency', () => {
  test.each([
    ['1', 2, '1'],
    ['1.000', 2, '1'],
    ['1.111', 2, '1.11'],
    ['1111.111', 2, '1,111.11'],
    ['1.1', 2, '1.1'],
    ['1.100000', 8, '1.1'],
    ['1000', 2, '1,000'],
    ['1900000', 2, '1,900,000'],
  ])('should create a correct number string', (ech, decimals, expected) => {
    expect(toCurrency(ech, decimals)).toBe(expected)
  })
})

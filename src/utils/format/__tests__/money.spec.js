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
    ['0.1', '0.1'],
    ['0.00000001', '0.00000001'],
    ['0.0000001', '0.0000001'],
    ['1.00000001', '1.00000001'],
    ['1.0000001', '1.0000001'],
    ['0.00001', '0.00001'],
    ['1', '1'],
    ['1.000', '1'],
    ['1.111', '1.111'],
    ['1111.111', '1,111.111'],
    ['1.1', '1.1'],
    ['1.100000', '1.1'],
    ['1000', '1,000'],
    ['1001.0010', '1,001.001'],
  ])('should create a correct number string', (ech, expected) => {
    expect(toCurrency(ech)).toBe(expected)
  })
})

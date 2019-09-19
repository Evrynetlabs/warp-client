import { formatNumber } from '@/utils/format'
import { removeLeadingZero } from '../number'

describe('formatNumber', () => {
  test.each([
    ['1,000', '1000'],
    ['10,000,000', '10000000'],
    ['10,000,000.0122', '10000000.0122'],
  ])('should create a correct number string', (ech, expected) => {
    expect(formatNumber(ech)).toBe(expected)
  })
})

describe('removeLeadingZero', () => {
  test.each([
    ['00001', '1'],
    ['0.1', '0.1'],
  ])('should create a correct number string', (ech, expected) => {
    expect(removeLeadingZero(ech)).toBe(expected)
  })
})
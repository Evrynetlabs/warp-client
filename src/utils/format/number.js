import numeral from 'numeral'
import min from 'lodash/min'
import split from 'lodash/split'

export const formatNumber = (amount) => {
  return removeTrailingDot(removeLeadingZero(amount))
}

export const cleanNonNumber = (amount) => {
  return amount.replace(/[^(\d|.)]/g, '')
}

export const removeTrailingDot = (amount) => {
  return amount.replace(/\.+$/g, '')
}

export const removeLeadingZero = (amount) => {
  return amount.replace(/^0*(?=[1-9]+)/g, '')
}

export const removeTrailingZero = (amount) => {
  return amount.replace(/0+$/g, '')
}

export const toCurrency = (amount, maxDecimals) => {
  const _decimals = split(amount, '.')[1]
    ? min([maxDecimals, split(amount, '.')[1].length])
    : 0
  if (!_decimals) return numeral(amount).format(`0,0`)
  let zeroes = ''
  for (let i = 0; i < _decimals; i++) {
    zeroes += 0
  }
  return removeTrailingDot(
    removeTrailingZero(numeral(amount).format(`0,0.${zeroes}`)),
  )
}

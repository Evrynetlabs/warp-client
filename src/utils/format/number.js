import numbro from 'numbro'
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

export const toCurrency = (amount) => {
  const _decimals = split(amount, '.')[1] ? split(amount, '.')[1].length : 0
  if (!_decimals) return numbro(amount).format({ thousandSeparated: true })
  let mantissa = 0
  for (let i = 0; i < _decimals; i++) {
    mantissa += 1
  }
  return removeTrailingDot(
    removeTrailingZero(
      numbro(amount).format({ thousandSeparated: true, mantissa }),
    ),
  )
}

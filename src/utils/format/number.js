import numeral from 'numeral'

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

export const toCurrency = (amount, decimals) => {
  let zeroes = ''
  for (let i = 0; i < decimals; i++) {
    zeroes += 0
  }
  return removeTrailingDot(
    removeTrailingZero(numeral(amount).format(`0,0.${zeroes}`)),
  )
}

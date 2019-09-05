import BigNumber from 'bignumber.js'
export const numberToCurrencyString = (number, decimals = 2) => {
  const bn = new BigNumber(number)
  return bn
    .toFixed(decimals)
    .replace(/(\d+)(?=(\d{3})+(?!\d)*\.)/g, '$1,')
    .replace(/0+\b(?<=\w)/g, '')
}

export const currencyToNumberString = (currency) => {
  return currency.replace(/[^0-9.-]+/g, '')
}

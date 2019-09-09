import BigNumber from 'bignumber.js'
export const numberToCurrencyString = (number, decimals = 2) => {
  const bn = new BigNumber(number)
  return bn
    .toFixed(decimals) // to fixed the number to have a desired decimal
    .replace(/(\d+)(?=(\d{3})+(?!\d)*\.)/g, '$1,') // format number to currency (,)
    .replace(/0+\b(?!\.)/g, '') // if decimals = 3 and the number if 1.100, it will be cut to 1.1, but if its 1.000, it will be cut to 1.
    .replace(/(\.)$/g, '$100') // special case if 1.000 and the previous regex has cut the number to 1. then convert 1. to 1.00
}

export const currencyToNumberString = (currency) => {
  return currency.replace(/[^0-9.-]+/g, '')
}

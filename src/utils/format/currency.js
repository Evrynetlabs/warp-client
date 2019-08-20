export const numberToCurrencyString = (number) => {
  return number.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

export const currencyToNumberString = (currency) => {
  return currency.replace(/[^0-9.-]+/g, '')
}

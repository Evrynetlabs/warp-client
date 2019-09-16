import BigNumber from 'bignumber.js'
import split from 'lodash/split'

export const numberToMoneyString = (number = '', decimals = 2) => {
  const parts = split(new BigNumber(number).toString(), '.')
  const hasDecimals = parts.length >= 2
  return `${Number(parts[0]).toLocaleString()}${
    hasDecimals
      ? '.' +
        new BigNumber(number)
          .minus(new BigNumber(parseInt(number)))
          .toFixed(decimals)
          .slice(2)
          .replace(/0+$/g, '')
      : ''
  }`
}

export const moneyToNumberString = (money) => {
  return money.replace(/[^0-9.-]+/g, '')
}

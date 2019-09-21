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

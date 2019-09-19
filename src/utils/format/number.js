export const formatNumber = (amount) => {
  return amount.replace(/[^(\d+|.)$]/g, '')
}

export const removeLeadingZero = (amount) => {
  return amount.replace(/^0*(?=[1-9]+)/g, '')
}

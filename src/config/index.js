const env = process.env.NODE_ENV
console.log(process.env.NODE_ENV, 'kasdiuasiduaoiufoiaufoi')

const development = {
  evrynet: {
    ATOMIC_STELLAR_DECIMAL_UNIT: 7,
    ATOMIC_EVRY_DECIMAL_UNIT: 18,
  },
}

const test = development

const production = {}

const config = {
  development,
  production,
  test,
}

export default config[env]

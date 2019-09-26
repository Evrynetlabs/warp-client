const env = process.env.NODE_ENV

const development = {
  evrynet: {
    ATOMIC_STELLAR_DECIMAL_UNIT: 7,
    ATOMIC_EVRY_DECIMAL_UNIT: 18,
  },
  chain: {
    EVRYNET: 'Evrynet',
    STELLAR: 'Stellar',
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

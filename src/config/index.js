const env = process.env.NODE_ENV
import cloneDeep from 'lodash/cloneDeep'

const development = {
  evrynet: {
    ATOMIC_STELLAR_DECIMAL_UNIT: 7,
    ATOMIC_EVRY_DECIMAL_UNIT: 18,
  },
}

const test = cloneDeep(development)

const production = cloneDeep(development)

const config = {
  development,
  production,
  test,
}

export default config[env]

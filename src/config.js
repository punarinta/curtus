const config = require('../config.json')

/**
 * @return {{server: {port: number}, inMemory: boolean, redirectOnError: string, salt: number}}
 */
const getConfig = () => {
  // TODO: merge with default config
  return config
}

module.exports = { getConfig }

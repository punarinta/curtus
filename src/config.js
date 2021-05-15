const { deepMerge } = require('./utils')
const config = require('../config.json')
const distConfig = require('../config.dist.json')

/**
 * @return {{
 *  server: {
 *    port: number,
 *    token: string | null,
 *  },
 *  inMemory: boolean,
 *  redirectOnError: string,
 *  salt: number,
 *  cleanup: {
 *    checkOnEvery: number,
 *    lifetime: number
 *  }
 * }}
 */
const getConfig = () => {
  return deepMerge(distConfig, config)
}

module.exports = { getConfig }

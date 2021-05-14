const { deepMerge } = require('./utils')
const config = require('../config.json')
const distConfig = require('../config.dist.json')

/**
 * @return {{server: {port: number}, inMemory: boolean, redirectOnError: string, salt: number}}
 */
const getConfig = () => {
  return deepMerge(distConfig, config)
}

module.exports = { getConfig }

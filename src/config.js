const { deepMerge } = require('./utils')
const distConfig = require('../config.dist.json')

let config = {}

/** @typedef ({
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
 * }) Config
 */

/**
 * @return {Config}
 */
const getConfig = () => {
  return deepMerge(distConfig, config)
}

/**
 * Set a new config. Useful for serverless mode.
 *
 * @param {Config} newConfig
 */
const setConfig = (newConfig) => {
  config = deepMerge({}, newConfig)
}

module.exports = { getConfig, setConfig }

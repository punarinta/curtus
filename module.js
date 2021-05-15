'use strict';

const db = require('./src/db.js')
const config = require('./src/config.js')

module.exports.db = db
module.exports.config = config

module.exports.init = (config) => {
  config.setConfig(config)
  db.dbInit()
}

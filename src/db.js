const fs = require('fs')
const sqlDb = require('better-sqlite3')
const { getConfig } = require('./config')
const { decode } = require('./qc')

let dbObject

/**
 * Connect to the database and assure the main table exists
 */
const dbInit = () => {
  try {
    dbObject = new sqlDb('./data/curtus.sqlite', { /* verbose: console.log */ })
  } catch (e) {
    console.log('Cannot establish DB connection')
    process.exit(0)
  }

  const row = dbObject.prepare("SELECT count(*) AS count FROM sqlite_master WHERE type='table' AND name='shorts'").get()

  if (row.count === 0) {
    console.log('Table does not exist. Creating a new one...')
    dbObject.exec(fs.readFileSync('./docs/db-scheme.sql', 'utf8'))
  }
}

/**
 * Shut down DB connection
 */
const dbShutdown = () => {
  if (dbObject) {
    dbObject.close()
  }
}

/**
 * Convert a quick code to a URL
 *
 * @param {string} code
 * @return {string|undefined}
 */
const getCodeUrl = (code) => {
  let id = 0

  try {
    id = decode(code, getConfig().salt)
  } catch (e) {
    return undefined
  }

  const row = dbObject.prepare('SELECT url FROM shorts WHERE id = ?').get(id)

  return row ? row.url : undefined
}

module.exports = { dbInit, dbShutdown, getCodeUrl }

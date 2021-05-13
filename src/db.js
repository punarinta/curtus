const fs = require('fs')
const sqlDb = require('better-sqlite3')
const { getConfig } = require('./config')
const { encode, decode } = require('./qc')

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
  const row = dbObject.prepare('SELECT url FROM shorts WHERE id = ?').get(decode(code, getConfig().salt))

  return row ? row.url : undefined
}

/**
 * Save a URL and return its quick code
 *
 * @param {string} url
 * @return {string|undefined}
 */
const saveUrl = (url) => {
  dbObject.prepare('INSERT INTO shorts (url) VALUES (?)').run(url)

  const row = dbObject.prepare('SELECT last_insert_rowid() AS id').get()

  try {
    return encode(row.id, getConfig().salt).toUpperCase()
  } catch (e) {
    return undefined
  }
}

module.exports = { dbInit, dbShutdown, getCodeUrl, saveUrl }

const fs = require('fs')
const sqlDb = require('better-sqlite3')
const { getConfig } = require('./config')
const { isDir } = require('./utils')
const { encode, decode } = require('./qc')

let dbObject

/**
 * Connect to the database and assure the main table exists
 */
const dbInit = () => {
  if (fs.existsSync('./data')) {
    if (!isDir('./data')) {
      console.log('"data" is not a directory')
      process.exit(0)
    }
  } else {
    // simply create a directory
    fs.mkdirSync('./data')
  }

  try {
    dbObject = new sqlDb(getConfig().inMemory ? ':memory:' : './data/curtus.sqlite', { /* verbose: console.log */ })
  } catch (e) {
    console.log('Cannot establish DB connection')
    process.exit(0)
  }

  const row = dbObject.prepare("SELECT count(*) AS count FROM sqlite_master WHERE type='table' AND name='shorts'").get()

  if (row.count === 0) {
    console.log('Table does not exist. Creating a new one...')
    dbObject.exec(fs.readFileSync(__dirname + '/../docs/db-scheme.sql', 'utf8'))
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

/**
 * Remove old URLs based on the configured lifetime
 */
const removeOldUrls = () => {
  const
    lifetime = getConfig().cleanup.lifetime,
    priorTo = Math.round((new Date()).getTime() / 1000) - lifetime

  if (lifetime !== -1) {
    dbObject.prepare("DELETE FROM shorts WHERE DATETIME(ts) < DATETIME(?, 'unixepoch')").run(priorTo)
  }
}

module.exports = { dbInit, dbShutdown, getCodeUrl, saveUrl, removeOldUrls }

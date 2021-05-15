const { getConfig } = require('./config')
const { Exception } = require('./utils')

/**
 * Authorize access using a bearer token
 *
 * @param {import('http').IncomingMessage} req
 */
const authorize = (req) => {
  const token = getConfig().server.token

  if (token && req.headers.authorization !== `Bearer ${token}`) {
    throw Exception('Access denied', 403)
  }
}

module.exports = { authorize }

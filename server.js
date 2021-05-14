const http = require('http')
const { getConfig } = require('./src/config')
const { respondToOptions } = require('./src/utils')
const { dbInit, dbShutdown, getCodeUrl, saveUrl } = require('./src/db')

process.on('SIGHUP', () => process.exit(128 + 1))
process.on('SIGINT', () => process.exit(128 + 2))
process.on('SIGTERM', () => process.exit(128 + 15))
process.on('exit', () => {
  console.log('Shutting down...')
  dbShutdown()
})

dbInit()

http.createServer((req, res) => {
  if (req.url === undefined) {
    return
  }

  if (req.url.startsWith('/shorten/')) {
    let
      code = 200,
      result = {}

    try {
      if (req.method.toUpperCase() === 'OPTIONS') {
        return respondToOptions(res)
      }

      result = { isError: false, data: saveUrl(decodeURIComponent(req.url.slice(9))), errMsg: null }
    } catch (err) {
      code = err.code === undefined ? 500 : err.code
      result = { isError: true, data: null, errMsg: typeof err.message === 'undefined' ? err : err.message }
      console.log(err)
    }

    if (!res.writableEnded) {
      res.writeHead(code, { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' })
      res.end(JSON.stringify(result))
    }
  } else {
    // redirect
    const url = getCodeUrl(req.url.slice(1))

    res.writeHead(302, { 'Location': url ?? getConfig().redirectOnError })
    res.end()
  }

  res.end()
}).listen(getConfig().server.port)

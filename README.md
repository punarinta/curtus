## Curtus
A fast and lightweight URL shortener. You can either deploy it as a standalone service or use as a library.
Two ways to store data: either using a built-in synchronous SQLite3 (a good compromise) or an in-memory database (very fast but data is lost in case of restart).

## Configuration options
- `server.port` — a port to listen to for HTTP requests
- `server.token` — authorization token string, set to `null` if not used
- `salt` — a random number from 0 to 10^9, must be constant for a given database
- `inMemory` — allows running with no file-based DB at all
- `redirectOnError` — a URL to redirect to when unpacking fails
- `cleanup.checkOnEvery` — a number of HTTP requests after which to check for outdated URLs
- `cleanup.lifetime` — a number in seconds for a **minimal** URL lifetime

## Setup (npm package only)
1. `npm i curtus --save`
2. Test code 
```js
const curtus = require('curtus')

curtus.init({/* config object */})

const
  quickCode = curtus.db.saveUrl('https://someurl.com/trololo'),
  restoredUrl = curtus.db.getCodeUrl(quickCode)

console.log('Code is', quickCode)
console.log('Restored URL is', restoredUrl)

// run this when you need to wipe out old records
curtus.db.removeOldUrls()

// you may run this on your app shutdown to keep things clean
curtus.db.dbShutdown()
```

## Setup (server only)
1. Create `config.json` file with the full or partial structure of `config.dist.json` if you need to change the default 
configuration. At least we recommend changing the salt.
2. `npm i` to install the packages.
3. `npm run server` to start a local server.

## Authorization (server only)
If necessary shortening can be protected when used via a built-in server. Configure `server.token` value (see above) and 
pass the token in a HTTP request header: `Authorization: Bearer YOUR_TOKEN_HERE`.

## To do
* automatic setup script for nginx environments
* cover with tests
* add performance tests
* type annotations and perfect code

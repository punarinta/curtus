## Curtus
A lightweight URL shortener. You can deploy it as a standalone service.

## Setup
1. Create `config.json` file with the full or partial structure of `config.dist.json` if you need to change the default 
configuration. At least we recommend changing the salt.
2. `npm i` to install the packages.
3. `npm run server` to start a local server.

## Configuration options
- `server.port` — a port to listen to for HTTP requests
- `salt` — a random number from 0 to 10^9, must be constant for a given database
- `inMemory` — allows to run with no file-based DB at all
- `redirectOnError` — a URL to redirect to when unpacking fails
- `cleanup.checkOnEvery` — a number of HTTP requests after which to check for outdated URLs
- `cleanup.lifetime` — a number in seconds for a **minimal** URL lifetime

## To do
* authentication
* automatic setup script for nginx environments
* NPM package to allow using this without a server
* type annotations and clean code style
* tests

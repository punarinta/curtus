## Curtus
A lightweight URL shortener.

## Configuration options
- `server.port` — a port to listen to for HTTP requests
- `salt` — a random number from 0 to 10^9, must be constant for a given database
- `inMemory` — allows to run with no file-based DB at all
- `redirectOnError` — a URL to redirect to when unpacking fails
- `cleanup.checkOnEvery` — a number of HTTP requests after which to check for outdated URLs
- `cleanup.lifetime` — a number in seconds for a **minimal** URL lifetime

## To do
* automatic setup script for nginx environments
* NPM package

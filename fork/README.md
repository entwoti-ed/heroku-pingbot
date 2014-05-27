# heroku-ping

A heroku ping node js library to keep you apps alive.

## Install

```
  npm install -g heroku-ping
```

## Usage

```
var heroku = require("heroku-ping");

heroku.ping({
  interval: 10000,     // milliseconds, defaults to 30 minutes
  silent: false,       // logging (default: false) 
  apps: [{
    name: 'yydigital', // heroku app name - required
    port: 80,          // not required
    path: "/blog",     // default to root
    secure: false      // requires https (defaults: false)
  },{
    name: 'tishadow'
  }]
});
```
## Licence: MIT

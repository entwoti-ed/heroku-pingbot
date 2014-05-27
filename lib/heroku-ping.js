var _ = require('underscore')
  , colors = require('colors')
  , async = require('async')
  , request = require('request')

exports.ping = function(options) {
  if ( !_.isArray(options.apps) || _.find(options.arr, function(a) { return !_.isObject(a) || a.name === undefined }) ) {
    console.error('invalid argument')
    return
  }
  // tasks:list of apps
  // map each app to a unique url
  var pingall = function() {
    var tasks = options.apps.map(function(app) {
      var url = (app.secure ? 'https://' : 'http://') +
                app.name + '.herokuapp.com' +
                (app.port ? ':' + app.port : '') +
                (app.path || '')
      return function() {
        (options.silent !== true) && console.log('Ping'.magenta.blackBG+' '+url.magenta)
        request(url, function (error, response, body) {
          if (options.silent !== true) {
            if (!error && response.statusCode == 200) {
              console.log('Pong'.cyan.blackBG+' '+url.cyan)
            } else {
              console.error("Error: " + url + " : " + error || response.statusCode)
            }
          }
        })
      }
    })
    async.parallel(tasks)
  }
  pingall()
  setInterval(pingall, options.interval || 1800000)
}

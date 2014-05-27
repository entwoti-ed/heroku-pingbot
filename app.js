var heroku = require("./fork/index")
  , names = require('./names.json')
  , port = process.env.PORT || 3004
  , dust = require('dustjs-linkedin')
  , favicon = require('serve-favicon')
  , path = require('path')
  , fs = require('fs')
  , pings = 0
  , apps = []

require('http').createServer(function(req,res) {
  // favicon stuff
  if(req.url === '/favicon.ico') {
		console.log('req:  '.magenta+req.url)
		var _favicon = favicon(path.join(__dirname,'/favicon.ico'))
		_favicon(req, res, function(err) {
			if(err) {
				res.statusCode = 500
				res.end('err')
				return
			}
			console.log('res:  '.cyan+req.url)
			res.end()
		})
  } else {
    // ping em
    heroku.ping({
      apps:names
    })
    // populate template, send to serverland
    var fsrs = fs.createReadStream('./index.html')
    var template = ''
    fsrs.setEncoding('utf8')
    fsrs.on('data', function(d) {
      template += d
    })
    fsrs.on('end', function() {
      var compiled = dust.compile(template, 'ping')
      dust.loadSource(compiled)
      for(i in names) {
        if(Object.keys(names).length-1 >= apps.length) apps.push(names[i])
      }
      dust.render('ping', {
        time:new Date().toTimeString(),
        apps:apps
      },function(err,d) {
        if(err) throw err
        res.end(d)
      })
    })
  }
}).listen(port, function() {
  console.log('listening on port ', port)
})

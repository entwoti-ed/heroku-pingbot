#!/usr/bin/env node

var renderTemplate = require('./lib/renderTemplate')
  , heroku = require("./lib/heroku-ping")
  , names = require('./names.json')
  , port = process.env.PORT || 3004
  , favicon = require('serve-favicon')
  , exec = require('child_process').exec
  , args = process.argv.slice(2)
  , qs = require('querystring')
  , path = require('path')
  , fs = require('fs')

// add new apps
if(args.length !== 0) {
  var i=0;
  while(i++ < args.length) {
    exec('curl -X POST -d name='+args[i]+' http://serene-ridge-4390.herokuapp.com/ --header "Content-Type:application/json"'),
    function(err,stdout,stderr) {
      if(err) throw err
      console.log('post: ',args[i])
    }
  }
}
require('http').createServer(function(req,res) {
  // favicon stuff
  if(req.url === '/favicon.ico') {
		var _favicon = favicon(path.join(__dirname,'/favicon.ico'))
		_favicon(req, res, function(err) {
			if(err) {
				res.statusCode = 500
				res.end('err')
				return
			}
			res.end()
		})
  } else if(req.url === '/' && req.method === 'POST') {
    var name = ''
    req.on('data',function(d) {
      name += d.toString()
    })
    req.on('end', function() {
      console.log('name',qs.parse(name))
      var n = qs.parse(name)
      for(var i=0; i<names.length; i++) {
        if(names[i].name === n.name) break
        if(i === names.length-1) {
          names.push(n)
          var ws = fs.createWriteStream('./names.json')
          ws.write(JSON.stringify(names))
          renderTemplate(res)
        }
      }
    })
  } else {
    // ping em
    heroku.ping({apps:names})
    // populate template, send to serverland
    renderTemplate(res)
  }
}).listen(port, function() {
  console.log('listening on port ', port)
})

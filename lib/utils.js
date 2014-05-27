var dust = require('dustjs-linkedin')
  , path = require('path')
  , fs = require('fs')
  , names = ''

exports.renderTemplate = function(res) {
  var fsrs = fs.createReadStream(path.join(__dirname,'../index.html'))
  var template = ''
  fsrs.setEncoding('utf8')
  fsrs.on('data', function(d) {
    template += d
  })
  fsrs.on('end', function() {
    var compiled = dust.compile(template, 'ping')
    dust.loadSource(compiled)
    names = require('../names.json')
    console.log(names)
    var apps = []
    for(i in names) {
      if(Object.keys(names).length-1 >= apps.length) apps.push(names[i])
    }
    var t = new Date().getTime()
    dust.render('ping', {
      time:(new Date(t-(1000*60*60*7))).toLocaleTimeString(),
      apps:apps
    },function(err,d) {
      if(err) throw err
      res.end(d)
    })
  })
}

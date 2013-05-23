//
// Johan Coppieters - jan 2013 - jWorks
//
//

// todo for the cody framework
//
// Front
// - sending mails with templates
//
// Back
// - forms
//
//
// todo general
// - Apache coupling for production
// - design model for data/meta-data (ex. product data)


var express = require('express');
var server = express();
var fs = require('fs');

var ejs = require('ejs');
var cody = require('./cody');
var essen = require('./site');

server.use(express.bodyParser());
server.use(express.cookieParser("a secret"));
server.use(express.cookieSession());


var app = new cody.Application({name: "cody", db: "cody", version: "v0.1a1", datapath: "."});
 // path should be  /usr/local  on production
 app.init();
 app.addController("AgendaController", essen.AgendaController);
 app.addController("BookingController", essen.BookingController);

server.all('/nl/*', function(req, res){
  app.servePage(req, res);
});


// next 2 should be done by Apache front end
server.get('/static/*', function(req, res){
  var fileserver = new cody.Static(req, res);
  fileserver.serve();
});

server.get('/data/*', function(req, res){
  var fileserver = new cody.Dynamic(req, res, app.getDataPath());
  fileserver.serve();
});


server.listen(3000);
console.log('Listening on port 3000');



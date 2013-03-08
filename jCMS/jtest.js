//
// Johan Coppieters - jan 2013 - jWorks
//
//

// missing versus Java
//
//  - consistent "this"
//  - function overloading
//  - compiler for typo's in attributes
//  - compiler checking for missing params

// todo for the jcms framework
//
// Front
// - log in, with sessions
// - sending mails with templates
//
// Back
// - everything (sitemap, ..., users)
//
//
// todo general
// - Apache coupling for production
// - design model for data/meta-data (ex. product data)


var express = require('express');
var server = express();
var fs = require('fs');

var ejs = require('ejs');
var jcms = require('./jcms');
var essen = require('./site');

server.use(express.bodyParser());
server.use(express.cookieParser("a secret"));
server.use(express.cookieSession());


var app = new jcms.Application("essen", "v0.1a1");
 app.init();
 app.addController("TAgendaController", essen.AgendaController);
 app.addController("TBookingController", essen.BookingController);



server.all('/nl/*', function(req, res){
  app.servePage(req, res);
});


// next 2 should be done by Apache front end
server.get('/static/*', function(req, res){
  var fileserver = new jcms.Static(req, res);
  fileserver.serve();
});

server.get('/data/*', function(req, res){
  var fileserver = new jcms.Dynamic(req, res);
  fileserver.serve();
});


server.listen(3000);
console.log('Listening on port 3000');



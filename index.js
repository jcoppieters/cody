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
var fs = require('fs');

var ejs = require('ejs');
var cody = require('./cody');

cody.server = express();

cody.server.use(express.bodyParser());
cody.server.use(express.cookieParser("a secret"));
cody.server.use(express.cookieSession());

cody.server.get("/cody/static/*", function(req, res){
  var fileserver = new cody.Static(req, res);
  fileserver.serve();
});


// startup all the webapplications

// var essen = require("./essen");
var codyweb = require("./codyweb");


cody.server.listen(3000);
console.log('Listening on port 3000');



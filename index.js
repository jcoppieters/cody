//
// Johan Coppieters - jan 2013 - jWorks
//
//

var express = require('express');
var fs = require('fs');

var ejs = require('ejs');
var cody = require('./cody');

cody.server = express();


// cookies are encrypted, so we need a pass phrase
cody.server.use(express.bodyParser());
cody.server.use(express.cookieParser("a secret"));
cody.server.use(express.cookieSession());


// startup a routing for all static content of cody (images, javascript, css)
cody.server.get("/cody/static/*", function(req, res){
  var fileserver = new cody.Static(req, res);
  fileserver.serve();
});

// startup a routing for the unit tests
cody.server.all("/cody/*", function(req, res){
  var aPath = new cody.Path( "cody/en/test", "cody", "en");
  var aContext = new cody.Context(aPath, null, null, req, res);
  res.render("../cody/views/front/index.ejs", { context: aContext });
});


// startup all the web applications

var essen = require("./essen");
var codyweb = require("./codyweb");
var empty = require("./empty");


cody.server.listen(3000);
console.log('Listening on port 3000');


if (!process.stderr.isTTY) {
  process.on('uncaughtException', function (err) {
    console.error('Uncaught exception : ' + err.stack);
  });
}

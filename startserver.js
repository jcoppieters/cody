"use strict";

/**
 * Created by johan on 27/04/16.
 *
 * Should be in a directory 1 level up.
 */

var express = require("express");
var vhost = require("vhost");

var tls = require("tls");
var fs = require("fs");

// pass your own objects/apps or use cody.makeWebApp to generate them

// apps should be an application object or an array of, each application object
//  should have
//     app [express application]
//     host [ string or array of strings ]
//  should have at least 1 of the 2 below
//     http [ portnumber for the http services ]
//     https [ portnumber for the https services ]
//  should have -if https port is specified-
//     certificate [ filename without extention of the key-pair ]


/*

startserver({ app: testApp, https: 443, host: "localhost", certificate: "mykey" });
 or
startserver([{...}, {...}]);
 or
 host: ["localhost", "www.mysite.com", ...]



Cody production example:
------------------------

var cody = require("cody");

cody.makeWebApp(__dirname, "mysite", function(app) {
  console.log("Loaded mysite web app with config:", cody.config);

  startServer(app);
});

// for multi site hosting, collect all app's in an array
// and when all set up, pass the array to startServer.


Cody development startup:
-------------------------

var cody = require("cody");

cody.makeWebApp(__dirname, "mysite", "config-devel.json", function(app) {
  console.log("loaded mysite");
  app.app.listen(app.http, function() {
    console.log("mysite listening on " + this.address().port);
  });
}

*/


// global express app, wrapping all other apps
var exp;

// global object containing for each domain the certificates
var sites;

// collected ports -> example = { 80: false, 443: true }
var ports = {};


module.exports = function( apps ) {
  // make our global express app and an empty site list
  exp = express();
  sites = [];


  if (apps instanceof Array) {
    for (let app of apps) {
      startApp(app);
    }
  } else {
    startApp(apps);
  }

  // get at least one listener
  var http = false;
  var https = false;
  for (let port in ports) {
    if (!ports[port]) http = true;
    if (ports[port]) https = true;
  }

  if (!http && !https) {
    http = true;
    ports[3000] = false;
  }

  console.log("==> ports:", ports);


  //////////
  // http //
  //////////
  if (http) {
    var httpFactory = require('http');
    var httpServer = httpFactory.createServer(exp);

    // http ports are "false"
    for (let port in ports)
      if (! ports[port])
        httpServer.listen(port, function () {
          console.log("Listening for http on port: " + this.address().port);
        });
  }

  ///////////
  // https //
  ///////////
  if (https) {
    var secureOpts = {
      SNICallback: function (domain, cb) {
        if (typeof sites[domain] === "undefined") {
          cb(new Error("domain not found"), null);
          console.log("Error: domain not found: " + domain);

        } else {
          cb(null, sites[domain]);
        }
      }
      /* left out the default keys:
        key:  fs.readFileSync('....key').toString(),
        cert: fs.readFileSync('....crt').toString()
      */
    };

    var httpsFactory = require('https');
    var httpsServer = httpsFactory.createServer(secureOpts, exp);

    // https ports are "true"
    for (let port in ports)
      if (ports[port])
        httpsServer.listen(port, function () {
          console.log("Listening https on port: " + this.address().port);
          console.log(" with certificates: ", sites);
      });

  }
};


function startApp( application ) {
  // collect extra portnumbers
  if (application.http && (typeof ports[application.http] === "undefined")) ports[application.http] = false;
  if (application.https && (typeof ports[application.https] === "undefined")) ports[application.https] = true;

  var certContext;

  // if the application has a certificate, create a tls credential context of it
  if ((application.certificate) && (application.certificate.length > 0)) {
    certContext = tls.createSecureContext({
        key: fs.readFileSync(application.certificate + '.key').toString(),
        cert: fs.readFileSync(application.certificate + '.crt').toString()
      }).context;
  }

  // start the application for each (virtual) host
  if (application.host instanceof Array) {
    for (let host of application.host) {
      startHost( host, application.app, certContext );
    }
  } else {
    startHost( application.host, application.app, certContext  );
  }
}


function startHost( host, app, certContext ) {
  console.log("added host " + host);
  exp.use(vhost(host, app));

  if (certContext) {
    // if we have a credential context, add it to our hashmap
    console.log("added certificates for " + host);
    sites[host] = certContext;
  }
}

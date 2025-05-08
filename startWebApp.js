console.log("loading " + module.id);

var cody = require("./index.js");
var express = require("express");
var vhost = require("vhost");

function startWebApp(mainServer, config, done) {
  console.log(" use: makeWebApp(pathname, sitedir, done);");
  console.log(" done = function(app) {} ");
  console.log(" app = {host: [names], app: express, http: integer, https: integer, certificate: pathto }");


  if (typeof config.name === "undefined") {
    console.log("startWebApp - missing name from config options");
    return false;
  }
  console.log("\n======= starting " + config.name + " =======");

  config.db = config.db || config.name;
  config.version = config.version || "v1.0";
  config.controllers = config.controllers || [];

  config.datapath = config.datapath || ".";

  var app = new cody.Application(config);

  for (var iC in config.controllers) {
    if (config.controllers.hasOwnProperty(iC)) {
      var C = config.controllers[iC];
      console.log("Adding controller: " + iC + " - " + C.constructor.name);
      app.addController(iC, C);
    }
  }

  app.init(function () {

    if ((config.hostnames !== undefined) && (config.hostnames !== "")) {

      var siteServer = express();

      for (var iL in app.languages) {
        // mysite.com/en/page
        siteServer.all("/" + app.prefix + "/" + app.languages[iL].id + "/*", function (req, res) {
          app.servePage(req, res);
        });

        // mysite.com/nl
        siteServer.all("/" + app.prefix + "/" + app.languages[iL].id, function (req, res) {
          console.log("------------------------------------------------------------------- " + new Date() + "--");
          console.log("-- redirecting to " + app.prefix + "/" + app.languages[iL].id + "/");
          res.redirect("/" + app.prefix + "/" + app.languages[iL].id + "/");
        });
      }

      // no language -> mysite.com
      siteServer.all("/" + app.prefix + "/", function (req, res) {
        console.log("------------------------------------------------------------------- " + new Date() + "--");
        console.log("-- redirecting to " + app.prefix + "/" + app.defaultlanguage + "/");
        res.redirect("/" + app.prefix + "/" + app.defaultlanguage + "/");
      });


      // mysite.com/static/file-path
      siteServer.get("/" + app.prefix + "/static/*", function (req, res) {
        var fileserver = new cody.Static(req, res, config.name, app.prefix);
        fileserver.serve();
      });

      // mysite.com/data/[category]file-id.extension (standard "files" and "images")
      siteServer.get("/" + app.prefix + "/data/*", function (req, res) {
        var fileserver = new cody.Dynamic(req, res, app.getDataPath(), app.prefix);
        fileserver.serve();
      });

      // mysite.com,www.mysite.com,mysite.be,...
      var hosts = config.hostnames.split(",");
      for (var iH in hosts) {
        mainServer.use(vhost(hosts[iH].trim(), siteServer));
        console.log("======= started " + config.name + " on " + hosts[iH] + " =======\n");
      }

    } else {
      console.log("Could not start app " + config.name + ": no vhost data");
    }


    if (typeof done === "function") {
        done();
    }

  });

}

module.exports = startWebApp;

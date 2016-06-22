console.log("loading " + module.id);

var cody = require("./index.js");
var express = require("express");
var vhost = require("vhost");

function startWebApp(mainServer, config, done) {
  console.log("=== deprecated ===");
  console.log(" use: makeWebApp(pathname, sitedir, done);");
  console.log(" done = function(app) {} ");
  console.log(" app = {host: [names], app: express, http: integer, https: integer, certificate: pathto }");
  console.log(" to test on localhost: app.app.listen(app.http);");
  console.log(" for production see startServer.js");
  console.log("=== deprecated ===");


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
        siteServer.all("/" + app.languages[iL].id + "/*", function (req, res) {
          app.servePage(req, res);
        });

        // mysite.com/nl
        siteServer.all("/" + app.languages[iL].id, function (req, res) {
          console.log("------------------------------------------------------------------- " + new Date() + "--");
          console.log("-- redirecting to " + "/" + app.languages[iL].id + "/");
          res.redirect("/" + app.languages[iL].id + "/");
          // app.servePage(req, res);
        });
      }

      // no language -> mysite.com
      siteServer.all("/", function (req, res) {
        console.log("------------------------------------------------------------------- " + new Date() + "--");
        console.log("-- redirecting to " + "/" + app.defaultlanguage + "/");
        res.redirect("/" + app.defaultlanguage + "/");
        //app.servePage(req, res);
      });


      // mysite.com/static/file-path
      siteServer.get("/static/*", function (req, res) {
        var fileserver = new cody.Static(req, res, config.name);
        fileserver.serve();
      });

      // mysite.com/data/[category]file-id.extension (standard "files" and "images")
      siteServer.get("/data/*", function (req, res) {
        var fileserver = new cody.Dynamic(req, res, app.getDataPath());
        fileserver.serve();
      });

      // mysite.com,www.mysite.com,mysite.be,...
      var hosts = config.hostnames.split(",");
      for (var iH in hosts) {
        mainServer.use(vhost(hosts[iH], siteServer));
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

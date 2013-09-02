console.log("loading " + module.id);

var cody = require("./index.js");
var express = require("express");

function startWebApp(server, config, done) {
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
      var thisApp = express();

      for (var iL in app.languages) {
        // mysite.com/nl/page
        thisApp.all("/" + app.languages[iL].id + "/*", function (req, res) {
          app.servePage(req, res);
        });

        // mysite.com/nl
        thisApp.all("/" + app.languages[iL].id, function (req, res) {
          app.servePage(req, res);
        });
      }
      // mysite.com
      thisApp.all("/", function (req, res) {
        app.servePage(req, res);
      });


      // mysite.com/static/file-path
      thisApp.get("/static/*", function (req, res) {
        var fileserver = new cody.Static(req, res, config.name);
        fileserver.serve();
      });

      // mysite.com/data/file-id.extension
      thisApp.get("/data/*", function (req, res) {
        var fileserver = new cody.Dynamic(req, res, app.getDataPath());
        fileserver.serve();
      });

      // mysite.com,www.mysite.com,mysite.be,...
      var hosts = config.hostnames.split(",");
      for (var iH in hosts) {
        server.use(express.vhost(hosts[iH], thisApp));
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

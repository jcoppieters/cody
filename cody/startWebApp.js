console.log("loading " + module.id);

var cody = require("./index.js");


function startWebApp( server, params, done ) {
  if (typeof params.name === "undefined") {
    console.log("startWebApp - missing name from config options");
    return false;
  }
  console.log("\n======= starting " + params.name + " =======");

  var config = require("../" + params.name + "/config.json");

  config.db = params.db || config.db || params.name;
  config.version = params.version || config.version || "v1.0";
  config.controllers = params.controllers || [];

  // path should be  /usr/local  on production
  config.datapath = params.datapath || config.datapath || ".";


  var app = new cody.Application(config);

  for (var iC in params.controllers) {
    var C = params.controllers[iC];
    console.log("Adding controller: " + C.name + " - " + C.controller.constructor.name);
    app.addController(C.name, C.controller);
  }

  app.init( function () {

    for (var iL in app.languages) {
      server.all("/" + params.name + "/" + app.languages[iL].id + "/*", function(req, res){
        app.servePage(req, res);
      });
    }

    server.get("/" + params.name + "/static/*", function(req, res){
      var fileserver = new cody.Static(req, res);
      fileserver.serve();
    });

    server.get("/" + params.name + "/data/*", function(req, res){
      var fileserver = new cody.Dynamic(req, res, app.getDataPath());
      fileserver.serve();
    });

    console.log("======= started " + params.name + " =======\n");
    if (typeof done === "function") { done(); }
  });

}

module.exports = startWebApp;

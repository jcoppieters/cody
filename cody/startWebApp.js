console.log("loading " + module.id);

var cody = require("./index.js");
var express = require("express");

function startWebApp(server, params, done, config) {
    if (typeof params.name === "undefined") {
        console.log("startWebApp - missing name from config options");
        return false;
    }
    console.log("\n======= starting " + params.name + " =======");

    if (config === undefined) {
        config = require("../" + params.name + "/config.json");
    }

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

    app.init(function () {

        if(!(params.hostname === undefined || params.hostname === "")) {
            var globalServer=server;
            var thisApp=express();

            for (var iL in app.languages) {
                thisApp.all("/" + app.languages[iL].id + "/*", function (req, res) {
                    app.servePage(req, res);
                });
            }

            thisApp.get("/" + params.name + "/static/*", function (req, res) {
                var fileserver = new cody.Static(req, res);
                fileserver.serve();
            });

            thisApp.get("/data/*", function (req, res) {
                var fileserver = new cody.Dynamic(req, res, app.getDataPath(), params.name);
                fileserver.serve();
            });

            globalServer.use(express.vhost(params.hostname, thisApp));

            console.log("======= started " + params.name + " =======\n");
        }else{
            console.log("Could not start app " + params.name + ": no vhost data");
        }


        if (typeof done === "function") {
            done();
        }
    });

}

module.exports = startWebApp;

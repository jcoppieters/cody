console.log("loading " + module.id);

var cody = require("cody");
var express = require("express");
var path = require("path");
var fs = require("fs");

/* usage:
  makeWebApp(pathname, sitedir, done);
  makeWebApp(pathname, sitedir, alternateConfigFile, done);
  // done = function(app) {}
  //  app = {host: [names], app: express, http: integer, https: integer, certificate: pathto }
  
  // to test on localhost: app.app.listen(app.http);
  
  // for production see startServer.js

 */

module.exports = function (pathname, sitename, configfn, done) {
  // make configfn optional
  if ((done === undefined) && (typeof configfn === "function")) {
    done = configfn;
    configfn = undefined;
  }

  var siteServer = express();

  // setup the config.
  //  Order of importance:
  //  1. config.json >> 2. -c command line config >> 3. environment values >> 4. minimal requirements


  // 1a. load default config & and keep in cody object
  var config = require(path.join(pathname, sitename, configfn || "config.json"));
  cody.config = config;


  // 1b. require controllers
  config.controllers = config.controllers || [];
  var cpath = path.join(pathname, sitename, "controllers");
  var ctrls = fs.readdirSync(cpath);
  ctrls.forEach(function (ctrl) {
    var cname = ctrl.substr(0, ctrl.indexOf("."));
    console.log("Loaded controller: " + cname);
    config.controllers[cname] = require(path.join(cpath, cname));
  });


  // 2. if -c exists, overwrite customized config values
  if(process.argv.indexOf("-c") != -1){
      var extraConfigFilePath = process.argv[process.argv.indexOf("-c") + 1];
      var obj = JSON.parse(fs.readFileSync(extraConfigFilePath, 'utf8'));
      Object.keys(config).forEach(function (name) {
        config[name] = (typeof obj[name] === "undefined") ? config[name] : obj[name];
      });
  }


  // 3. overwrite environment variable values
  Object.keys(config).forEach(function (name) {
    config[name] = (typeof process.env[name] === "undefined") ? config[name] : process.env[name];
  });



  // 4. minimal requirements
  if (typeof config.name === "undefined") {
      console.log("startWebApp - missing name from config options");
      return false;
  }
  config.db = config.db || config.name;
  config.version = config.version || "v1.0";
  config.controllers = config.controllers || [];

  config.datapath = config.datapath || ".";

  // previous versions of cody used "port" instead of "http" as portnumber parameter for http listens
  if ((typeof config.http === "undefined") && (config.port != -1))
    config.http = config.port;


  // 5. make the cody app
  console.log("\n======= making " + config.name + " =======");
  var app = new cody.Application(config);

  for (var iC in config.controllers) {
    if (config.controllers.hasOwnProperty(iC)) {
      var C = config.controllers[iC];
      console.log("Adding controller: " + iC + " - " + C.constructor.name);
      app.addController(iC, C);
    }
  }

  app.init(function () {

    if ((typeof config.hostnames === "undefined") || (config.hostnames === "")) {
      console.log("Could not start app " + config.name + ": no vhost data");
      return false;

    }

    // add i18n
    var i18n = require("i18n");
    i18n.configure({
        locales:['zh-cn', 'en'],
        directory: __dirname + '/locales',
        defaultLocale: 'en'
    });
    siteServer.use(i18n.init);


    // use the new 4.x middleware
    var bodyParser = require("body-parser");
    var expressSession = require("express-session");
    var multer = require("multer");

    siteServer.use(bodyParser.json());
    siteServer.use(bodyParser.urlencoded({ extended: true }));
    siteServer.use(expressSession({secret: 'a secret', cookie: { maxAge: 60*60*1000 },
                                   resave: false, saveUninitialized: false}));
    siteServer.use(multer());


    // startup a routing for all static content of cody (images, javascript, css)
    siteServer.get("/cody/static/*", function (req, res) {
        var fileserver = new cody.Static(req, res, "");
        fileserver.serve();
    });

    function doLanguage(lan) {
      console.log("setup " + lan.name + " as /" + lan.id);
      // mysite.com/en/page
      siteServer.all("/" + lan.id + "/*", function (req, res) {
        app.servePage(req, res);
      });

      // mysite.com/nl
      siteServer.all("/" + lan.id, function (req, res) {
        console.log("------------------------------------------------------------------- " + new Date() + "--");
        console.log("-- redirecting to " + "/" + lan.id + "/");
        res.redirect("/" + lan.id + "/");
        // app.servePage(req, res);
      });
    }

    for (var iL in app.languages) {
      doLanguage(app.languages[iL]);
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


    if (typeof done === "function") {
      done({
        host: config.hostnames.split(","),
        app: siteServer,
        http: config.http,
        https: config.https,
        certificate: path.join(pathname, config.certificate)
      });
    }

  });

};

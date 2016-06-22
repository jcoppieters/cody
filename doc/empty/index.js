/**
 * Created by johan on 25/03/15.
 */
//
// Johan Coppieters - jan 2013 - Cody CMS
//
// empty website for Cody CMS
//
//

var cody = require("cody");
var express = cody.express;
var fs = cody.fs;
var path = require("path");


cody.server = express();
var bodyParser = cody.bodyParser;
var expressSession = cody.expressSession;
var multer = cody.multer;

var sitename = __filename.split(path.sep).pop().split(".")[0];

// add i18n
var i18n = cody.i18n;
i18n.configure({
    locales:['zh-cn', 'en'],
    directory: __dirname + '/locales',
    defaultLocale: 'en'
});
cody.server.use(i18n.init);

// use the new 4.x middleware
cody.server.use(bodyParser());
cody.server.use(expressSession({secret: 'a secret', cookie: { maxAge: 60*60*1000 }}));
cody.server.use(bodyParser.urlencoded({ extended: true }));
cody.server.use(multer());


// startup a routing for all static content of cody (images, javascript, css)
cody.server.get("/cody/static/*", function (req, res) {
    var fileserver = new cody.Static(req, res, "");
    fileserver.serve();
});


// setup the config.
//  Order of importance:
//  1. config.json >> 2. -c command line config >> 3. environment values


// 1a. load default config
cody.config = require(path.join(__dirname, sitename, "config.json"));
cody.config.controllers = cody.config.controllers || [];

// 1b. require controllers
var cpath = path.join(__dirname, sitename, "controllers");
var ctrls = fs.readdirSync(cpath);
ctrls.forEach(function (ctrl) {
  var cname = ctrl.substr(0, ctrl.indexOf("."));
  console.log("Loaded controller: " + cname);
  cody.config.controllers[cname] = require(path.join(cpath, cname));
});


// 2. if -c exists, overwrite customized config values
if(process.argv.indexOf("-c") != -1){
    var extraConfigFilePath = process.argv[process.argv.indexOf("-c") + 1];
    var obj = JSON.parse(fs.readFileSync(extraConfigFilePath, 'utf8'));
    Object.keys(cody.config).forEach(function (name) {
      cody.config[name] = (typeof obj[name] === "undefined") ? cody.config[name] : obj[name];
    });
}

// 3. overwrite environment variable values
Object.keys(cody.config).forEach(function (name) {
  cody.config[name] = (typeof process.env[name] === "undefined") ? cody.config[name] : process.env[name];
});


// start the web app with all collected params
cody.startWebApp(cody.server, cody.config, function() {
  console.log("Loaded " + sitename + " web app with config:");
  console.log(cody.config);
  var portNr = cody.config.port || 3001;
  cody.server.listen(portNr);
  console.log("Listening on port " + portNr);


  if (typeof cody.config.https != "undefined") {
    const options = {
      key: fs.readFileSync('ws.key').toString(),
      cert: fs.readFileSync('ws.crt').toString()
    };
    var httpsServer = require('https');
    httpsServer.createServer(options, cody.server).listen(cody.config.https, function () {
      console.log("Listening https on port: " + cody.config.https);
    });
  }
});


if (!process.stderr.isTTY) {
    process.on('uncaughtException', function (err) {
        console.error('Uncaught exception : ' + err.stack);
    });
}

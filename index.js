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
cody.server.get("/cody/static/*", function (req, res) {
    var fileserver = new cody.Static(req, res);
    fileserver.serve();
});

// startup a routing for the unit tests
cody.server.all("/cody/*", function (req, res) {
    var aPath = new cody.Path("cody/en/test", "cody", "en");
    var aContext = new cody.Context(aPath, null, null, req, res);
    res.render("../cody/views/front/index.ejs", { context: aContext });
});


// startup all the web applications
var websites = Array();

websites.push({
                    "name": "empty",
                    "version": "v0.1a1",
                    "config": {
                        "dbuser": "cody",
                        "dbpassword": "ydoc",
                        "dbhost": "localhost",
                        "datapath": "/usr/local/data/empty",
                        "name": "empty",
                        "db": "empty"
                    },
                    webapp: null,
                    customcontrollers: []
                 });
websites.push({
                    "name": "codyweb",
                    "version": "v0.1a1",
                    "config": {
                        "dbuser": "cody",
                        "dbpassword": "ydoc",
                        "dbhost": "localhost",
                        "datapath": "/usr/local/data/codyweb",
                        "name": "codyweb",
                        "db": "codyweb"
                    },
                    webapp: null,
                    customcontrollers: []
                 });
websites.push({
                    "name": "essen",
                    "version": "v0.1a1",
                    "config": {
                        "dbuser": "cody",
                        "dbpassword": "ydoc",
                        "dbhost": "localhost",
                        "datapath": "/usr/local/data/essen",
                        "name": "essen",
                        "db": "essen"
                    },
                    webapp: null,
                    customcontrollers: ["AgendaController", "BookingController"]
                 });

websites.forEach(function (website) {
    var currentWebsite = require("./" + website.name + "/controllers/");

    if(website.config === undefined){
        website.config = [];
    }
    if(website.config.controllers === undefined){
        website.config.controllers = [];
    }

    website.customcontrollers.forEach(function(customcontrollername){
        //TODO: eval is evil
        website.config.controllers.push({name: customcontrollername, controller: eval("currentWebsite."+customcontrollername)});
    });

    website.webapp = cody.startWebApp(cody.server, {
        name: website.name,
        datapath: "./" + website.name + "/data", //we might want to move this into a new variable again
        // datapath: "/usr/local/data/empty",
        version: website.version,
        controllers: website.config.controllers
    }, undefined, website.config);

});


//console.log(JSON.stringify(websites[2].config));
cody.server.listen(3000);
console.log('Listening on port 3000');


if (!process.stderr.isTTY) {
    process.on('uncaughtException', function (err) {
        console.error('Uncaught exception : ' + err.stack);
    });
}

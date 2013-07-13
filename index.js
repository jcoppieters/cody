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

var codyApp = new cody.Application({
    "testing": false,
    "logging": false
});

codyApp.bootstrapSite = function(website){
    var currentWebsite = require("./" + website.name + "/controllers/");

    if(website.config === undefined){
        website.config = [];
    }
    if(website.config.controllers === undefined){
        website.config.controllers = [];
    }
    website.config.name=website.name; //TODO: remove duplicate field

    website.customcontrollers.forEach(function(customcontrollername){
        if(customcontrollername !== undefined && customcontrollername != ""){
            website.config.controllers.push({name: customcontrollername,
                                            controller: eval("currentWebsite." + customcontrollername)});
        }
    });
    website.webapp = cody.startWebApp(cody.server, {
        name: website.name,
        datapath: "./" + website.name + "/data", //we might want to move this into a new variable again
        // datapath: "/usr/local/data/empty",
        version: website.version,
        controllers: website.config.controllers
    }, undefined, website.config);

};

var connection = codyApp.getConnection();
connection.connect();

//connection.query("SELECT controllername FROM websitecontrollers WHERE websiteId="+row.id, function(err, rows, fields){
connection.query('SELECT name, version, dbuser, dbpassword, dbhost, datapath, db, customcontrollers FROM websites ORDER BY id', function(err, rows, fields) {
    if(err) throw err;
    rows.forEach(function(row){
        var theWebsite = {
            "name": row.name,
            "version": row.version,
            "config": {
                "dbuser": row.dbuser,
                "dbpassword": row.dbpassword,
                "dbhost": row.dbhost,
                "datapath": row.datapath,
                "name": row.name,
                "db": row.db
            },
            webapp: null,
            customcontrollers: row.customcontrollers.split(",")  //TODO: transform into 1-n (n>=0) relationship, but this appears to be quite complex to handle
        };

        codyApp.bootstrapSite(theWebsite);
    });
});
//});
connection.end();

console.log("length: " + codyApp.websites);


cody.server.listen(3000);
console.log('Listening on port 3000');


if (!process.stderr.isTTY) {
    process.on('uncaughtException', function (err) {
        console.error('Uncaught exception : ' + err.stack);
    });
}

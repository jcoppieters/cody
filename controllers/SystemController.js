
console.log("loading " + module.id);

var mysql = require("mysql");
var cody = require("./../index.js");
var fs = require("fs");
var path = require("path");
var util = require("util");

var mysql = require('mysql');

module.exports = SystemController;

function SystemController(context) {
    var self = this;
    this.formView = "-/cms/system.ejs";

    console.log("SystemController.constructor");
    //this.formView = "-/cms/styles.ejs";
    // init inherited controller
    cody.Controller.call(self, context);
}

SystemController.prototype = Object.create( cody.Controller.prototype );


//fetch config values from database
SystemController.prototype.doRequest = function( finish ) {
    var self=this;

    var hostname = self.context.req.headers.host;
    if(hostname.indexOf(":") >= 0){
        hostname = (hostname.split(":"))[0];
    }
    hostname = self.escape(hostname);
    self.query("SELECT * FROM cody.websites WHERE hostname=" +  hostname + " OR hostname LIKE " + self.escape("%,"+hostname) + " OR hostname LIKE " + self.escape(hostname + ",%"), function(err, results){
        if (err) throw err;
        if(results.length > 0){
            var result = results[0];
            self.context.config = result;
            self.formView = "-/cms/system.ejs";
            if(self.isRequest("OK")){
                self.query("UPDATE cody.websites SET hostname=" + self.escape(self.getParam("hostname", hostname)) + " WHERE hostname=" + hostname, function(err2, results2){
                    self.context.config.hostname = self.getParam("hostname", hostname);
                    finish(self.formView);
                    cody.bootstrap();
                });
            }else{
                finish(self.formView);
            }
        }

    });

};
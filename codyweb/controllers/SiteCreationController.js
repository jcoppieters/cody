//
// Laurens Ramandt - jul 2013 - Codyweb
//
//
console.log("loading " + module.id);

var mysql = require("mysql");
var cody = require("../../cody/index.js");

module.exports = SiteCreationController;

function SiteCreationController(context) {
    var self=this;

    console.log("SiteCreationController.constructor -> page: ("
        + context.page.itemId + ") " + context.page.title);
    //self.connection = context.application.getConnection();



    cody.Controller.call(this, context);
}

SiteCreationController.prototype = Object.create( cody.Controller.prototype );


SiteCreationController.prototype.doRequest = function( finish ) {

    var self=this;//this.loginView = "-/login.ejs";

    if(self.isRequest("createsite")){
        console.log("yes");
    }   else{
        console.log("no");
    }
    //TODO: move this to model

    var values = [self.getParam("websitename"), "", self.getParam("websitename"), self.getParam("adminpassword"), "localhost", "/usr/local/data/"+self.getParam("websitename"), self.getParam("websitename"), "Y", self.getParam("hostname")];
    self.query("insert into cody.websites (name, version, dbuser, dbpassword, dbhost, datapath, db, active, hostname) VALUES(?,?,?,?,?,?,?,?,?)", values, function(err, result){
        console.log("err: " + err);
    });

    finish();
};

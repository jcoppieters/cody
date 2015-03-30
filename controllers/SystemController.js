
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

  console.log("SystemController.constructor -> page(" + context.page.itemId + ") = " + context.page.title + ", request = " + context.request);

    // init inherited controller
    cody.Controller.call(self, context);
}
SystemController.prototype = Object.create( cody.Controller.prototype );


//fetch config values from database
SystemController.prototype.doRequest = function( finish ) {
  var self = this;
  self.context.fn = "-/cms/system.ejs";

  if (self.isRequest("reload")) {
    self.app.init(function() {
      self.feedback(true, "System reloaded.");
      finish();
    });

  } else if (self.isRequest("Save")) {
    self.query("UPDATE cody.websites SET hostname=? WHERE id=?", [this.getParam("hostname"), this.getParam("id")], function (err2, results2) {
      self.doList(function() {
        self.app.init(function() {
          self.feedback(true, "Parameters saved and system reloaded.");
          finish();
        });
      });
    });

  } else if (self.isRequest("Hosting")) {
    self.doList(finish);

  } else {
    finish();
  }

};

SystemController.prototype.doList = function(finish) {
  var self = this;

  var hostname = self.context.req.headers.host;
  if (hostname.indexOf(":") >= 0) {
    hostname = (hostname.split(":"))[0];
  }
  var hostnameA = self.escape("%," + hostname);
  var hostnameB = self.escape(hostname + ",%");
  hostname = self.escape(hostname);

  self.query("SELECT * FROM cody.websites WHERE hostname=" + hostname + " OR hostname LIKE " + hostnameA + " OR hostname LIKE " + hostnameB, function (err, results) {
    if (err) throw err;
    if (results.length > 0) {
      var result = results[0];
      self.context.config = result;
      finish(self.formView);
    }
  });
};

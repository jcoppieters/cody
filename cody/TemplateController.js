//
// Johan Coppieters - may 2013 - cody
//
//
console.log("loading " + module.id);

var mysql = require("mysql");
var cody = require("./index.js");


function TemplateController(context) {
  console.log("TemplateController.constructor -> page(" + context.page.itemId + ") = " + context.page.title + ", request = " + context.request);

  // init inherited controller
  cody.Controller.call(this, context);
}

TemplateController.prototype = Object.create( cody.Controller.prototype );
module.exports = TemplateController;



TemplateController.prototype.doRequest = function( finish ) {
  var self = this;

  // request for displaying the login screen
  if (self.isRequest("") || this.isRequest("list")) {
    self.doList( finish );

  } else if (self.isRequest("save")) {
    self.doSave( this.getInt("id", -1), function() {
      self.setRequest("list");
      self.doList( finish );
    });

  } else if (self.isRequest("delete")) {
    self.doDelete( this.getInt("id", 0), function() {
      self.setRequest("list");
      self.doList( finish );
    });

  } else if (this.isRequest("edit")) {
    self.doGet( this.getInt("id", -1), finish);

  } else if (this.isRequest("new")) {
    self.doGet( NaN, finish );

  } else {
    finish();
  }

  return null;
};



TemplateController.prototype.doDelete = function( theId, finish ) {
  var self = this;

  var aTemplate = this.app.deleteTemplate(theId);
  if (typeof aTemplate != "undefined") {
    aTemplate.doDelete(self, function() {
      self.feedBack(true, "Successfully deleted the template");
      finish();
    });
  } else {
    self.feedBack(false, "Failed to delete the template");
    finish();
  }
};


TemplateController.prototype.doSave = function( theId, finish ) {
  var self = this;
  var aTemplate = self.app.getTemplate(theId);
  if (typeof aTemplate == "undefined") {
    aTemplate = new cody.Template({id: 0}, self.app.controllers);
  }
  aTemplate.scrapeFrom(self);
  aTemplate.doUpdate(self, finish);
};


TemplateController.prototype.doGet = function(id, finish) {
  var self = this;

  if ((typeof id == "undefined") || isNaN(id) || (id === 0)) {
    self.context.template = new cody.Template({id: 0}, self.app.controllers);
  } else {
    self.context.template = self.app.getTemplate(id);
  }
  finish();
};


TemplateController.prototype.doList = function(finish) {
  var self = this;
  self.context.templates = self.app.templates;

  finish();
};


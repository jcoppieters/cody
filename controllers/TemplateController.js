//
// Johan Coppieters - may 2013 - cody
//
//
console.log("loading " + module.id);

var mysql = require("mysql");
var cody = require("../index.js");


function TemplateController(context) {
  console.log("TemplateController.constructor -> page(" + context.page.itemId + ") = " + context.page.title + ", request = " + context.request);

  // init inherited controller
  cody.Controller.call(this, context);
}

TemplateController.prototype = Object.create( cody.Controller.prototype );
module.exports = TemplateController;



TemplateController.prototype.doRequest = function( finish ) {
  var self = this;
  var thisId = this.getInt("id", -1);

  // request for displaying the login screen
  if (self.isRequest("") || this.isRequest("list")) {
    self.doList( finish );

  } else if (self.isRequest("save")) {
    self.doSave( thisId, function() {
      self.setRequest("list");
      self.doList( finish );
    });

  } else if (self.isRequest("duplicate")) {
    self.doDuplicate( thisId, function(newId) {
      self.doGet( newId, finish);
    });

  } else if (self.isRequest("delete")) {
    self.doDelete( thisId, function() {
      self.setRequest("list");
      self.doList( finish );
    });

  } else if (this.isRequest("edit")) {
    self.doGet( thisId, finish);

  } else if (this.isRequest("new")) {
    self.doGet( NaN, finish );


  } else if (self.isRequest("addcontent")) {
    self.doAddContent( thisId, self.getParam("content", "S"), function() {
      self.doGet( thisId, finish);
    });

  } else if (self.isRequest("delcontent")) {
    self.doDelContent( thisId, self.getParam("content", 0), function() {
      self.doGet( thisId, finish);
    });

  } else {
    finish();
  }

  return undefined;
};



TemplateController.prototype.doDelete = function( theId, finish ) {
  var self = this;

  if (self.app.templateUsed(theId)) {
    self.feedBack(false, "Failed to delete the template, it is still in use by some pages");
    finish();
    return;
  }

  var aTemplate = this.app.deleteTemplate(theId);
  if (typeof aTemplate !== "undefined") {
    aTemplate.doDelete(self, function() {
      aTemplate.deleteAllContent(self, function() {
        self.feedBack(true, "Successfully deleted the template and its content");
        finish();
      });
    });
  } else {
    self.feedBack(false, "Failed to delete the template, it was not found");
    finish();
  }
};


TemplateController.prototype.doSave = function( theId, finish ) {
  var self = this;
  var aTemplate = self.app.getTemplate(theId);
  if (typeof aTemplate === "undefined") {
    aTemplate = new cody.Template({id: 0}, self.app.controllers);
  }
  aTemplate.scrapeFrom(self);
  aTemplate.doUpdate(self, function() {
    aTemplate.updateContent(self, function() {
      self.feedBack(true, "Successfully saved the template and its content");
      finish();
    });
  });
};


TemplateController.prototype.doDuplicate = function( theId, finish ) {
  var self = this;
  var aTemplate = self.app.getTemplate(theId);
  var newTemplate = new cody.Template(aTemplate, self.app.controllers);
  newTemplate.id = 0; // mark as new

  newTemplate.scrapeFrom(self);
  if (newTemplate.name === aTemplate.name) {
    newTemplate.name = newTemplate.name + " copy";
  }

  // create the template in the database
  newTemplate.doUpdate(self, function() {

    // duplicate content blocks
    newTemplate.copyContentFrom(self, theId, function() {

      self.feedBack(true, "Successfully duplicated the template");
      finish(newTemplate.id);
    });
  });
};

TemplateController.prototype.doGet = function(id, finish) {
  var self = this;
  var aTemplate;

  // get or make the template object
  if ((typeof id === "undefined") || isNaN(id) || (id === 0)) {
    aTemplate = new cody.Template({id: 0}, self.app.controllers);

    // store it in the context for our view
    self.context.template = aTemplate;

    // terminate -> new template is ready for editing
    finish();

  } else {
    aTemplate = self.app.getTemplate(id);

    // store it in the context for our view
    self.context.template = aTemplate;

    // attach all its content objects
    aTemplate.fetchContent(self.app, id, finish);
  }
};


TemplateController.prototype.doList = function(finish) {
  var self = this;
  self.context.templates = self.app.templates;

  finish();
};


///////////////////
// Content Stuff //
///////////////////

TemplateController.prototype.doAddContent = function( theId, kind, finish ) {
  var self = this;
  var aTemplate = self.app.getTemplate(theId);
  aTemplate.addContent(self, theId, kind, function() {
    self.feedBack(true, "Successfully added content to the template");
    finish();
  });
};

TemplateController.prototype.doDelContent = function( theId, theContent, finish ) {
  var self = this;
  var aTemplate = self.app.getTemplate(theId);
  aTemplate.deleteContent(self, theContent, function() {
    self.feedBack(true, "Successfully deleted content to the template");
    finish();
  });
};



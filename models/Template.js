//
// Johan Coppieters - jan 2013 - jWorks
//
//
var cody = require('./../index.js');

console.log("loading " + module.id);


function Template(basis, controllers) {
  // copy from basis
  for (var a in basis) {
    if (basis.hasOwnProperty(a)) {
      this[a] = basis[a];
    }
  }

  if (typeof basis.controller === "string") {
    this.findController(basis.controller, controllers);
  }

  this.fn = this.fn || "index.ejs";
  this.allowedtemplates = this.allowedtemplates || this.id;              //TODO: not yet implemented !!
  this.maxnumber = (isNaN(this.maxnumber)) ? 999 : this.maxnumber;       //TODO: not yet implemented !!
  this.system = this.system || "N";
  this.defaultchild = this.defaultchild || this.id ;
  this.description = this.description || "";

  this.content = [];
}

module.exports = Template;


Template.prototype.findController = function(aControllerName, controllers) {
  // find controller based on its name
  this.controllerName = aControllerName;
  this.controller = controllers[aControllerName];

  if (typeof this.controller === "undefined") {
    console.log("Template.findController -> controllerName = " + aControllerName + " not found");
    // if no controller found -> attach standard Controller
    this.controller = controllers['Controller'];
  }
};

Template.loadTemplates = function(connection, store) {
  connection.query('select * from templates', [], function(err, result) {
    if (err) { console.log(err); throw(new Error("Template.loadTemplates failed with sql errors")); }
    store(result);
  });
};


Template.prototype.getController = function(context) {
  return new this.controller(context);
};
Template.prototype.getView = function() {
  return this.fn;
};



Template.prototype.scrapeFrom = function(controller) {
  this.name = controller.getParam("name", this.username);
  var aControllerName = controller.getParam("controller", this.controller);
  this.findController(aControllerName, controller.app.controllers);
  this.fn = controller.getParam("fn", this.fn);
  this.allowedtemplates = controller.getParam("allowedtemplates", this.allowedtemplates);
  this.maxnumber = controller.getParam("maxnumber", this.maxnumber || 9999);
  this.system = controller.getParam("system", this.system || "N");
  this.defaultchild = controller.getParam("defaultchild", this.defaultchild);
  this.description = controller.getParam("description", this.description);
};


Template.prototype.doDelete = function(controller, done) {
  var self = this;
  controller.query("delete from templates where id = ?", [self.id], done);
};


Template.prototype.doUpdate = function(controller, finish) {
  var self = this;
  var values = [self.name, self.description, self.controllerName, self.fn, self.allowedtemplates,
                self.maxnumber, self.system, self.defaultchild];

  // new or existing record
  if ((typeof self.id === "undefined") || (self.id === 0)) {

    console.log("insert template " + this.name);
    controller.query("insert into templates (name, description, controller, fn,  allowedtemplates, maxnumber, system, defaultchild) " +
      "values (?, ?, ?, ?,  ?, ?, ?, ?)", values,
      function(err, result) {
        if (err) {
          console.log(err); throw(new Error("Template.doUpdate/insert failed with sql errors"));
        } else {
          self.id = result.insertId;
          controller.app.templates[self.id] = self;
          console.log("inserted new template: " + self.id);
          if (typeof finish === "function") { finish(); }
        }
      });

  } else {
    console.log("update template " + self.id + " - " + this.name);
    values.push(self.id);
    controller.query("update templates set name = ?, description = ?, controller = ?, fn = ?, " +
      " allowedtemplates = ?, maxnumber = ?, system = ?, defaultchild = ? " +
      "where id = ?", values,
      function(err) {
        if (err) {
          console.log(err); throw(new Error("Template.doUpdate/update failed with sql errors"));
        } else {
          controller.app.templates[self.id] = self;
          console.log("updated template: " + self.id);
          if (typeof finish === "function") { finish(); }
        }
      });
  }
};


// Content Stuff //

Template.prototype.fetchContent = function(app, id, finish) {
  var self = this;
  // apply a page method to a template...  sorry guys...
  cody.Page.prototype.fetchContent.call(self, app, "*", -1 * id, finish);

};


Template.prototype.sortContent = function() {
  this.content.sort( function(a, b) {
    if (a.intro === b.intro) {
      return (a.sortorder - b.sortorder);
    } else if (a.intro === 'Y') {
      return -1;
    } else {
      return 1;
    }
  });
};

Template.prototype.updateContent = function( controller, finish ) {
  var self = this;

  cody.Application.each(self.content, function(next) {
    var aContent = this;
    aContent.scrapeFromWithId(controller);
    aContent.doUpdate(controller, false, next);

  }, function(err){
    self.sortContent();
    finish();
  });
};


Template.prototype.addContent = function( controller, theId, theKind, finish ) {
  var self = this;
  var name = "New " + cody.Content.kindName(theKind);
  controller.query("insert into content (item,language,sortorder,intro,kind,atom,name,data) values (?, '*', 999, 'N', ?, 0, ?, '')",
                   [-1 * theId, theKind, name], function(err) {
    // before template content was language independent the query was:
    //  insert into content (item,language,sortorder,intro,kind,atom,name,data) select ?, id, 999, 'N', ?, 0, 'New Block', '' from languages
    console.log("inserted content with " + (-1 * theId) + " of kind " + theKind + ", error = ["+err+"]");
    finish();
  });
};

Template.prototype.copyContentFrom = function( controller, fromTemplate, finish ) {
  var self = this;
  controller.query("insert into content select 0,?,language,sortorder,intro,kind,atom,name,data from content a where a.item = ?",
    [-1 * self.id, -1 * fromTemplate], finish);
};

Template.prototype.deleteAllContent = function( controller, finish ) {
  var self = this;
  controller.query("delete from content where item = ?", [-1 * self.id], finish);
};


Template.prototype.deleteContent = function( controller, theContent, finish ) {
  var self = this;
  controller.query("delete from content where id = ?", [theContent], finish);
};
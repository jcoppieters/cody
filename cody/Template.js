//
// Johan Coppieters - jan 2013 - jWorks
//
//
var cody = require('./index.js');

console.log("loading " + module.id);


function Template(basis, controllers) {
  // copy from basis
  for (var a in basis) {
    if (basis.hasOwnProperty(a)) {
      this[a] = basis[a];
    }
  }
  
  this.findController(basis.controller, controllers);

  this.fn = this.fn || "index.ejs";
  this.allowedtemplates = this.allowedtemplates || this.id;              //TODO: not yet implemented !!
  this.maxnumber = (isNaN(this.maxnumber)) ? 999 : this.maxnumber;       //TODO: not yet implemented !!
  this.system = this.system || "N";
  this.defaultchild = this.defaultchild || this.id ;

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
}

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

Template.prototype.doDelete = function(controller, done) {
  var self = this;
  controller.query("delete from templates where id = ?", [self.id], done);
};


Template.prototype.scrapeFrom = function(controller, finish) {
  this.name = controller.getParam("name", this.username);
  var aControllerName = controller.getParam("controller", this.controller);
  this.findController(aControllerName, controller.app.controllers);
  this.fn = controller.getParam("fn", this.fn);
  this.allowedtemplates = controller.getParam("allowedtemplates", this.allowedtemplates);
  this.maxnumber = controller.getParam("maxnumber", this.maxnumber || 9999);
  this.system = controller.getParam("system", this.system || "N");
  this.defaultchild = controller.getParam("defaultchild", this.defaultchild);
};

Template.prototype.doUpdate = function(controller, finish) {
  var self = this;
  var values = [self.name, self.controllerName, self.fn, self.allowedtemplates,
                self.maxnumber, self.system, self.defaultchild];

  // new or existing record
  if ((typeof self.id == "undefined") || (self.id === 0)) {

    console.log("insert template " + this.name);
    controller.query("insert into templates (name, controller, fn,  allowedtemplates, maxnumber, system, defaultchild) " +
      "values (?, ?, ?,  ?, ?, ?, ?)", values,
      function(err, result) {
        if (err) {
          console.log(err); throw(new Error("Template.doUpdate/insert failed with sql errors"));
        } else {
          self.id = result.insertId;
          controller.app.templates[self.id] = self;
          console.log("inserted new template: " + self.id);
          if (typeof finish == "function") { finish(); }
        }
      });

  } else {
    console.log("update template " + self.id + " - " + this.name);
    values.push(self.id);
    controller.query("update templates set name = ?, controller = ?, fn = ?, " +
      " allowedtemplates = ?, maxnumber = ?, system = ?, defaultchild = ? " +
      "where id = ?", values,
      function(err) {
        if (err) {
          console.log(err); throw(new Error("Template.doUpdate/update failed with sql errors"));
        } else {
          controller.app.templates[self.id] = self;
          console.log("updated template: " + self.id);
          if (typeof finish == "function") { finish(); }
        }
      });
  }
};

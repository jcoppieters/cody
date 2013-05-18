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
  
  // find controller based on its name
  this.controllerName = this.controller;
  this.controller = controllers[this.controllerName];
  
  if (typeof this.controller === "undefined") {
    console.log("Template - controllerName = " + this.controllerName + " not found");
  }
  
  // if no controller found -> attach standard Controller
  if (typeof this.controller === "undefined") {
    this.controller = controllers['Controller'];
  }
}

module.exports = Template;



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


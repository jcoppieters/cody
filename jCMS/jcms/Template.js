//
// Johan Coppieters - jan 2013 - jWorks
//
//
var jcms = require('./index.js');

console.log("loading " + module.id);

module.exports = Template;

function Template(basis, controllers) {
  // copy from basis
  for (var a in basis) {
    if (basis.hasOwnProperty(a))
      this[a] = basis[a];
  }
  // stay compatible with current rWorks databases
  this.fn += ".ejs";
  if (this.fn.indexOf("/") < 0) {
    this.fn = "front/" + this.fn;
  }
  
  // find controller based on the class name
  var className = this['class'];
  this.controller = controllers[className];
  
  // if no controller found -> attach standard Controller
  if (this.controller == null) {
    this.controller = controllers['Controller'];
  }
}

Template.loadTemplates = function(connection, store) {
  connection.query('select * from templates', [], function(err, result) {
    store(result);
  });
};


Template.prototype.getController = function(context) {
  return new this.controller(context);
}
Template.prototype.getView = function() {
  return this.fn;
}

Template.prototype.render = function (res, fn, context) {

  // read fn
  var x = "";
  
  // replace ${...}  to  <%=  %>
  //   and ask ejs to render the rest
  res.render(x.replace(/<${(.*?)}/g, "<%=$1%>"), context);
}
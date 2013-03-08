//
// Johan Coppieters - jan 2013 - De Essen
//
//
console.log("loading " + module.id);

var mysql = require("mysql");
var jcms = require("../jcms/index.js");

module.exports = AgendaController;

function AgendaController(context) {
  console.log("AgendaController.constructor -> page: ("
                + context.page.itemId + ") " + context.page.title);
  
  jcms.Controller.call(this, context);
}

AgendaController.prototype = new jcms.Controller();


AgendaController.prototype.needsLogin = function() {
  return true;
}

AgendaController.prototype.doRequest = function( finish ) {
  finish();
}


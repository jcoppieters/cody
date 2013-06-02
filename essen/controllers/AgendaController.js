//
// Johan Coppieters - jan 2013 - De Essen
//
//
console.log("loading " + module.id);

var mysql = require("mysql");
var cody = require("../../cody/index.js");

module.exports = AgendaController;

function AgendaController(context) {
  console.log("AgendaController.constructor -> page: ("
                + context.page.itemId + ") " + context.page.title);
  
  cody.Controller.call(this, context);
}

AgendaController.prototype = Object.create( cody.Controller.prototype );


AgendaController.prototype.doRequest = function( finish ) {
  finish();
};


//
// Johan Coppieters - may 2013 - cody
//
//
console.log("loading " + module.id);

var cody = require("../index.js");


function DashboardController(context) {
  console.log("DashboardController.constructor -> page(" + context.page.itemId + ") = " + context.page.title + ", request = " + context.request);

	// init inherited controller
	cody.Controller.call(this, context);
}

DashboardController.prototype = Object.create( cody.Controller.prototype );
module.exports = DashboardController;



DashboardController.prototype.doRequest = function( finish ) {
  var self = this;
  
  finish();
};



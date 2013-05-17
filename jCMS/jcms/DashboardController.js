//
// Johan Coppieters - may 2013 - jCMS
//
//
console.log("loading " + module.id);

var mysql = require("mysql");
var jcms = require("./index.js");


function DashboardController(context) {
  console.log("DashboardController.constructor -> page(" + context.page.itemId + ") = " + context.page.title + ", request = " + context.request);
  	  
	// init inherited controller
	jcms.Controller.call(this, context);
}

DashboardController.prototype = Object.create( jcms.Controller.prototype );
module.exports = DashboardController;



DashboardController.prototype.doRequest = function( finish ) {
  var self = this;
  
  finish();
};



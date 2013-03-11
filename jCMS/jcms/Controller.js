//
// Johan Coppieters - jan 2013 - jWorks
//
//
console.log("loading " + module.id);

var mysql = require("mysql");

module.exports = Controller;

function Controller(context) {
  // only called for using my methods
  if (context == undefined) return;
  
  console.log("Controller.constructor -> page: ("
              + context.page.itemId + ") " + context.page.title);

  this.request = context.request;
  this.context = context;
  context.controller = this;

  this.app = context.app;
  this.connection = this.app.getConnection();
  
  // console.log(this.context);
}

Controller.prototype.needsLogin = function() {
  return false;
};
Controller.prototype.getLogin = function() {
	var session = this.context.session;
  	return (session) ? session.login : {};
};

Controller.prototype.close = function() {
  this.closeConnection();
};

Controller.prototype.doRequest = function( finish ) {
  console.log("Controller.doRequest -> request = " + this.request);
  //console.log(this.context);
  
  // if you don't want any rendering to be done:
  //  set this.context.fn to empty or pass an empty string
  finish();
};

Controller.prototype.feedBack = function(success, message) {
  this.context.status = (success) ? "success" : "error";
  this.context.message = message;
  this.context.success = success;
};

// Parameter handling
Controller.prototype.getDate = function(paramName, defaultValue) {
  return this.context.getDate(paramName, defaultValue);
};
Controller.prototype.getParam = function(paramName, defaultValue) {
  return this.context.getParam(paramName, defaultValue);
};

// Query stuff
Controller.prototype.query = function(sql, params, callback) {
  this.connection.query(sql, params, callback);
};

Controller.prototype.closeConnection = function() {
  if (this.connection) {
    this.connection.end();
    this.connection = null;
  }
};


// output utilities

Controller.prototype.gen = function( theObject ) {
    this.context.res.writeHead(200, { "Content-Type": "application/json" });
    if (typeof theObject != "String")
    	this.context.res.write(JSON.stringify(theObject));
    else
		this.context.res.write(theObject);
	this.context.res.end()
}


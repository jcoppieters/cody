//
// Johan Coppieters - jan 2013 - jWorks
//
//
console.log("loading " + module.id);

var mysql = require("mysql");
var jcms = require("./index.js");

module.exports = Controller;

function Controller(context) {
  // only called for using my methods
  if (typeof context == "undefined") { return; }
  console.log("Controller.constructor -> page(" + context.page.itemId + ") = " + context.page.title + ", request = " + context.request);
  
  this.request = context.request;
  this.context = context;
  context.controller = this;

  this.app = context.app;
  this.connection = this.app.getConnection();
  
  // console.log(this.context);
}

Controller.prototype.needsLogin = function() {
	return (this.context) && (this.context.page) && (this.context.page.needsLogin());
};
Controller.prototype.isLoggedIn = function() {
	return (this.context) && (this.context.isLoggedIn());
};
Controller.prototype.getLogin = function() {
  return (this.context) ? (this.context.getLogin()) : new jcms.User({});
};

Controller.prototype.getLoginId = function() {
  var login = this.getLogin();
  return (login) ? login.id : null;
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
    this.app.returnConnection(this.connection);
    this.connection = null;
  }
};

// General utilities


// output utilities

Controller.prototype.gen = function( theContent, theHeader ) {
  if (typeof theHeader == "undefined") {
    this.context.res.writeHead(200, { "Content-Type": "application/json" });
  } else {
    this.context.res.writeHead(200, theHeader);
  }
  
  if (typeof theContent != "string") {
    this.context.res.write(JSON.stringify(theContent));
  } else {
    this.context.res.write(theContent);
  }
  this.context.res.end();
};


//
// Johan Coppieters - jan 2013 - jWorks
//
//
console.log("loading " + module.id);

var mysql = require("mysql");
var jcms = require("./index.js");


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

module.exports = Controller;

Controller.prototype.close = function() {
  this.closeConnection();
};


//
// core handler
//

Controller.prototype.doRequest = function( finish ) {
  console.log("Controller.doRequest -> request = " + this.request);
  //console.log(this.context);
  
  // if you don't want any rendering to be done:
  //  pass an empty string (or set this.context.fn to empty) 
  finish();
};

Controller.prototype.isRequest = function(theString) {
  return (this.context) && (this.context.request === theString);
};
Controller.prototype.setRequest = function(theString) {
  if (this.context) {
    this.context.request = theString;
  }
};

//
// User login stuff -- most of the time proxied to the context object 
//

Controller.prototype.needsLogin = function() {
	return (this.context) && (this.context.page) && (this.context.page.needsLogin());
};
Controller.prototype.isLoggedIn = function() {
	return (this.context) && (this.context.isLoggedIn());
};
Controller.prototype.getLogin = function() {
  return (this.context) ? (this.context.getLogin()) : new jcms.User({});
};
Controller.prototype.setLogin = function(theUser) {
  if (this.context) { 
    this.context.setLogin(theUser); 
  }
};

Controller.prototype.getLoginId = function() {
  var login = this.getLogin();
  return (login) ? login.id : null;
};
Controller.prototype.getLoginLevel = function() {
  var login = this.getLogin();
  return (login) ? login.level : 0;
};



//
// Parameter handling
//
Controller.prototype.getDate = function(paramName, defaultValue) {
  return this.context.getDate(paramName, defaultValue);
};
Controller.prototype.getParam = function(paramName, defaultValue) {
  return this.context.getParam(paramName, defaultValue);
};
Controller.prototype.getInt = function(paramName, defaultValue) {
  var x = this.context.getParam(paramName, defaultValue);
  if (typeof x != "number") { x = parseInt(x, 10); }
  return isNaN(x) ? defaultValue : x;
};
Controller.prototype.getNum = function(paramName, defaultValue, precision) {
  var x = this.context.getParam(paramName, defaultValue);
  if (typeof x != "number") { x = parseFloat(x); }
  if (isNaN(x)) { x = defaultValue; }
  if (typeof precision != "undefined") { x = x.toFixed(precision); }
  return x;
};


//
// Query stuff
//

Controller.prototype.query = function(sql, params, callback) {
  // callback = function(error, results)
  
  this.connection.query(sql, params, callback);
};

Controller.prototype.closeConnection = function() {
  console.log("Controller -> connection closed");
  
  if (this.connection) {
    this.app.returnConnection(this.connection);
    this.connection = null;
  }
};


// General utilities



//
// Output & feedback utilities
//

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

Controller.prototype.feedBack = function(success, message) {
  this.context.status = (success) ? "success" : "error";
  this.context.message = message;
  this.context.success = success;
};




//
// Johan Coppieters - jan 2013 - jWorks
//
//
console.log("loading " + module.id);

var mysql = require("mysql");
var cody = require("../index.js");


function Controller(context) {
  // only called for using my methods
  if (typeof context === "undefined") { return; }
  if (context.page) {
    console.log("Controller.constructor -> page(" + context.page.itemId + ") = " + context.page.title + ", request = " + context.request);
  }
  
  this.context = context;
  context.controller = this;

  this.app = context.app;
  this.connection = (this.app) ? this.app.getConnection() : null;
  
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
  console.log("Controller.doRequest -> request = " + this.getRequest());
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
Controller.prototype.getRequest = function() {
  return (typeof this.context === "undefined") ? "" : this.context.request;
};


Controller.prototype.getId = function(defaultValue) {
  if (typeof defaultValue === "undefined") defaultValue = -1;

  var x = this.context.getParam("id");
  x = (typeof x === "undefined") ? NaN : parseInt(x, 10);

  if (isNaN(x)) {
    x = this.context.path.id;
    x = (typeof x === "undefined") ? NaN : parseInt(x, 10);
  }

  return isNaN(x) ? defaultValue : x;
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
  return (this.context) ? (this.context.getLogin()) : new cody.User({});
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
  if (typeof x !== "number") { x = parseInt(x, 10); }
  return isNaN(x) ? defaultValue : x;
};

Controller.prototype.getNum = function(paramName, defaultValue, precision) {
  var x = this.context.getParam(paramName, defaultValue);
  if (typeof x !== "number") { x = parseFloat(x); }
  if (isNaN(x)) { x = defaultValue; }
  if (typeof precision !== "undefined") { x = x.toFixed(precision); }
  return x;
};

Controller.prototype.getUNum = function(paramName, defaultValue) {
  var anId = this.context.getParam(paramName);
  if ((typeof anId === "undefined") || (anId === "")) {
    return (typeof defaultValue === "undefined") ? 0 : defaultValue;
  } else  {
    var i = anId.indexOf("_");
    if (i >= 0) {
      return parseInt(anId.substring(i+1), 10);
    } else {
      return parseInt(anId, 10);
    }
  }
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

Controller.prototype.render =  function( theContent ) {
  return "<!-- unknown content type = " + theContent.kind + ", atomId = " + theContent.atomId + ", data = " + theContent.data + "-->";
};

Controller.prototype.gen = function( theContent, theHeader ) {
  if (typeof theHeader === "undefined") {
    this.context.res.writeHead(200, { "Content-Type": "application/json" });
  } else {
    this.context.res.writeHead(200, theHeader);
  }
  
  if (typeof theContent !== "string") {
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


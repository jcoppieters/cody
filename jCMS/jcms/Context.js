//
// Johan Coppieters - jan 2013 - jWorks
//
//
console.log("loading " + module.id);
var jcms = require("./index.js");

module.exports = Context;

function Context(path, page, app, req, res) {
  this.version = app.version;
  
  this.page = page;
  this.app = app;
  this.req = req;
  this.res = res;
  this.path = path;
  
  this.pagelink = app.getPageLink(path);
  this.subdomain = app.getSubDomain(path);
  //console.log("pagelink = " + this.pagelink + ", subdomain = " + this.subdomain);

  // copy query params and body params into this.params and .param
  this.params = {};
  for(var x in req.query) this.params[x] = req.query[x];
  for(var x in req.body) this.params[x] = req.body[x];
  
  this.request = this.params.request || this.subdomain || "";
  
  this.status = "success";
  this.message = "";
  
  this.dateFormat = "dd-mm-yyyy";
      
  this.min = ""; // ".min"
  this.context = "";
  this.static = this.context + "/static";
  this.dynamic = this.context + "/data";
  this.fn = page.getView();
  
  this.session = req.session;
  this.setLogin(this.session.login);
}

Context.prototype.setLogin = function(login) {
	this.session.login = login;
	this.login = new jcms.User(login);
};
Context.prototype.isLoggedIn = function() {
  return (this.login) && (this.login.active == "Y");
};
Context.prototype.getLogin = function() {
	return this.login || new jcms.User({});
};


Context.prototype.getMini = function() {
  var mini = {};
  
  mini.params = {};
  for(var x in this.params) { mini.params[x] = this.params[x]; }
  mini.params = this.params;
  
  mini.path = this.path;
  mini.request = this.request;
  mini.context = this.context;
  mini.static = this.static;
  mini.dynamic = this.dynamic;
  mini.fn = this.fn;
  
  return mini;
};

Context.prototype.copyFromMini = function(mini) {
  this.params = {};
  for(var x in mini.params) { this.params[x] = mini.params[x]; }
  
  this.path = mini.path;
  this.request = mini.request;
  this.context = mini.context;
  this.static = mini.static;
  this.dynamic = mini.dynamic;
  this.fn = mini.fn;
  
  this.page = this.app.findPage(this.path, this.page.language);
};

Context.prototype.getUnique = function() {
  return new Date().getTime();
};
Context.prototype.formatTime = function(aDate) {
  return aDate.getHours() + ":" + aDate.getMinutes() + ":" + aDate.getSeconds();
};
Context.prototype.formatShortTime = function(aDate) {
  return aDate.getHours() + ":" + aDate.getMinutes();
};

Context.prototype.formatDate = function(aDate) {
  function two(n) {
    return (n < 10) ? ("0" + n) : n;
  }
  if (this.dateFormat == "dd-mm-yyyy") {
    return two(aDate.getDate()) + "-" + two(aDate.getMonth()+1) + "-" + aDate.getFullYear();

  } else if (this.dateFormat == "mm-dd-yyyy") {
    return two(aDate.getMonth()+1) + "-" + two(aDate.getDate()) + "-" + aDate.getFullYear();

  } else { // "yyyy-mm-dd"
    return aDate.getFullYear() + "-" + two(aDate.getMonth()+1) + "-" + two(aDate.getDate());
  }
};

Context.prototype.getDate = function(paramName, defaultValue) {
  // should look at the current locale of the user page
  //  for now we depend on the dateFormat field of this context
  
  var x = this.req.param(paramName);
  if (typeof x == "undefined") { return defaultValue; }
  
  var parts = (x.indexOf("-") > 0) ? x.split("-") : x.split("/");

  if (this.dateFormat == "dd-mm-yyyy") {
    return (parts.length < 3) ? 
      defaultValue : new Date(parts[2], parts[1]-1, parts[0]);
    
  } else if (this.dateFormat == "mm-dd-yyyy") {
    return (parts.length < 3) ? 
      defaultValue : new Date(parts[2], parts[0]-1, parts[1]);
    
  } else { // "yyyy-mm-dd"
   return (parts.length < 3) ? 
      defaultValue : new Date(parts[0], parts[1]-1, parts[0]);
  }
};

Context.prototype.getParam = function(paramName, defaultValue) {
  var x = this.params[paramName];
  return (typeof x == "undefined") ? defaultValue : x;
};

Context.prototype.setParam = function(paramName, value) {
  this.params[paramName] = value;
};


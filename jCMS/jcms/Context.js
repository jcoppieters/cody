//
// Johan Coppieters - jan 2013 - jWorks
//
//
console.log("loading " + module.id);

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
		  
  this.min = ""; // ".min"
  this.context = "";
  this.static = "/static";
  this.dynamic = "/data";
  this.fn = page.getView();
  
  this.session = req.session;
  this.login = this.session["login"];
}

Context.prototype.getMini = function() {
  var mini = {};
  
  mini.params = {};
  for(var x in this.params) mini.params[x] = this.params[x];
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
  for(var x in mini.params) this.params[x] = mini.params[x];
  
  this.path = mini.path;
  this.request = mini.request;
  this.context = mini.context;
  this.static = mini.static;
  this.dynamic = mini.dynamic;
  this.fn = mini.fn;
  
  this.page = this.app.findPage(this.path, this.page.language);

};


Context.prototype.ddmmyyyy = function(aDate) {
  function two(n) {
    return (n < 10) ? ("0" + n) : n;
  }
  return two(aDate.getDate()) + "-" + two(aDate.getMonth()+1) + "-" + aDate.getFullYear();
};

Context.prototype.getDate = function(paramName, defaultValue) {
  // should look at the current locale of the user page
  //  for now it is dd-mm-yyyy or dd/mm/yyyy
  
  var x = this.req.param(paramName);
  if (x == undefined) return defaultValue;
  
  if (x.indexOf("-") > 0)
    parts = x.split("-");
  else
    parts = x.split("/");
  
  if (parts.length < 3)
    return defaultValue;
  else
    return new Date(parts[2], parts[1]-1, parts[0]);
}

Context.prototype.getParam = function(paramName, defaultValue) {
  var x = this.params[paramName];
  return (x == undefined) ? defaultValue : x;
}

Context.prototype.setParam = function(paramName, value) {
  this.params[paramName] = value;
}


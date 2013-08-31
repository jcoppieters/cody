//
// Johan Coppieters - jan 2013 - jWorks
//
//
console.log("loading " + module.id);
var cody = require("../index.js");


function Context(path, page, app, req, res) {
  this.version = (app) ? app.version : "v0.0";

  this.page = page;
  this.app = app;
  this.req = req;
  this.res = res;
  this.path = path;

  // copy query params and body params into this.params and .param
  this.params = {};
  for(var q in req.query) {
    if (req.query.hasOwnProperty(q)) {
      this.params[q] = req.query[q];
    }
  }
  for(var b in req.body) {
    if (req.body.hasOwnProperty(b)) {
      this.params[b] = req.body[b];
    }
  }
  this.request = this.params.request || path.request || "";

  this.status = "success";
  this.message = "";

  this.dateFormat = "dd-mm-yyyy";

  this.min = ""; // ".min"
  this.static = "/static";
  this.dynamic = "/data";
  this.cstatic = "/cody/static";

  this.fn = (page) ? page.getView() : "index.ejs";

  this.session = req.session;
  this.setLogin(this.session.login);

  // make global cody lib available
  this.cody = cody;
}
module.exports = Context;


//
// mini contexts for saving in between login requests
//

Context.prototype.getMini = function() {
  var mini = {};

  mini.params = {};
  for(var x in this.params) {
    if (mini.params.hasOwnProperty(x)) {
      mini.params[x] = this.params[x];
    }
  }
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
  for(var x in mini.params) {
    if (mini.params.hasOwnProperty(x)) {
      this.params[x] = mini.params[x];
    }
  }

  this.path = mini.path;
  this.request = mini.request;
  this.context = mini.context;
  this.static = mini.static;
  this.dynamic = mini.dynamic;
  this.fn = mini.fn;

  this.page = this.app.findPage(this.path, this.page.language);
};


//
// Render content
//
Context.prototype.render = function(params) {
  // supported param's, (not_)kind =, (not_)name =, intro = true/false

  for (var ic in this.page.content) {
    var C = this.page.content[ic];
    if (params.name && (C.name != params.name))
      continue;
    if (params.not_name && (C.name == params.not_name))
      continue;
    if (params.kind && (C.kind != params.kind))
      continue;
    if (params.not_kind && (C.kind == params.not_kind))
      continue;
    if (params.intro && (C.intro != params.intro))
      continue;

    return C.render(this.controller);
  }
};


//
// login stuff
//

Context.prototype.setLogin = function(login) {
  this.session.login = login;
  this.login = new cody.User(login);
};
Context.prototype.isLoggedIn = function() {
  return (this.login) && (this.login.active === "Y");
};
Context.prototype.getLogin = function() {
  return this.login || new cody.User({});
};


//
// General utilities
//

Context.prototype.getUnique = function() {
  return new Date().getTime();
};

Context.prototype.checked = function( bool ) {
  return (bool) ? 'checked' : '';
};

Context.prototype.optionList = function(theList, theId, theIdName, theNameName) {
  var x = "";
  var first = cody.Application.findFirst(theList);

  if (typeof first === "string") {
    for (var j=0; j < theList.length; j++) {
      var S = theList[j];
      x += "<option value=\"" + S + "\"" + ((S == theId) ? "selected" : "") + ">" + S + "</option>\n";
    }

  } else {
    var idName = theIdName || "id";
    var nameName = theNameName || "name";

    for (var i in theList) {
      if (theList.hasOwnProperty(i)) {
        var O = theList[i];
        x += "<option value=\"" + O[idName] + "\"" + ((O[idName] == theId) ? "selected" : "") + ">" + O[nameName] + "</option>\n";
      }
    }
  }
  return x;
};

Context.prototype.find = function(theList, theId, theIdName) {
  var idName = theIdName || "id";
  for (var i=0; i < theList.length; i++) {
    var R = theList[i];
    if (R[idName] == theId) {
      return R;
    }
  }
  return {};
};


//
// Param handlers
//

Context.prototype.getParam = function(paramName, defaultValue) {
  var x = this.params[paramName];
  return (typeof x === "undefined") ? defaultValue : x;
};

Context.prototype.setParam = function(paramName, value) {
  this.params[paramName] = value;
};



function two(n) {
  return (n < 10) ? ("0" + n) : n;
}

Context.prototype.formatTime = function(aDate) {
  return two(aDate.getHours()) + ":" + two(aDate.getMinutes()) + ":" + two(aDate.getSeconds());
};
Context.prototype.formatShortTime = function(aDate) {
  return two(aDate.getHours()) + ":" + two(aDate.getMinutes());
};

// should look at the current locale of the user page
//  for now we depend on the dateFormat field of this context
Context.prototype.formatDate = function(aDate) {

    return "28-08-2013";
    /*if(aDate === undefined || aDate.getDate === undefined){
        aDate = new Date(2013,8,28);
    } */

  if (this.dateFormat === "dd-mm-yyyy") {
    return two(aDate.getDate()) + "-" + two(aDate.getMonth()+1) + "-" + aDate.getFullYear();

  } else if (this.dateFormat === "mm-dd-yyyy") {
    return two(aDate.getMonth()+1) + "-" + two(aDate.getDate()) + "-" + aDate.getFullYear();

  } else { // "yyyy-mm-dd"
    return aDate.getFullYear() + "-" + two(aDate.getMonth()+1) + "-" + two(aDate.getDate());
  }
};

Context.prototype.makeDate = function(value, defaultValue) {
  if (typeof x === "undefined") { return defaultValue; }

  var parts = (x.indexOf("-") > 0) ? x.split("-") : x.split("/");

  if (this.dateFormat === "dd-mm-yyyy") {
    return (parts.length < 3) ?
      defaultValue : new Date(parts[2], parts[1]-1, parts[0]);

  } else if (this.dateFormat === "mm-dd-yyyy") {
    return (parts.length < 3) ?
      defaultValue : new Date(parts[2], parts[0]-1, parts[1]);

  } else { // "yyyy-mm-dd"
    return (parts.length < 3) ?
      defaultValue : new Date(parts[0], parts[1]-1, parts[0]);
  }
}


Context.prototype.makeInt = function(value, defaultValue) {
  if (typeof value !== "number") { value = parseInt(value, 10); }
  return isNaN(value) ? defaultValue : value;
}

Context.prototype.makeNum = function(value, defaultValue, precision) {
  if (typeof value !== "number") { value = parseFloat(value); }
  if (isNaN(value)) { value = defaultValue; }
  if (typeof precision !== "undefined") { value = value.toFixed(precision); }
  return value;
}




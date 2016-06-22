//
// Johan Coppieters - jan 2013 - Cody
//
//
console.log("loading " + module.id);
var cody = require("../index.js");

//
// Context
//
// Created by Application in buildContext as results of servePage for every request,
// containing all the context info for that request.
//
// Accessible through the controller of the request.
// All its properties are accessible as globals for the view rendered for that request.
//
// Additionally provides some helpers (formatting/utitlities), thus accessible by the views.

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
  this.request = this.params.request || path.request || page.item.defaultrequest || "";

  this.status = "success";
  this.message = "";
  this.host = req.headers.host;
  this.dateFormat = "dd-mm-yyyy";

  this.min = ""; // ".min"
  this.static = "/static";
  this.dynamic = "/data";
  this.cstatic = "/cody/static";

  var stringPage = app.getPage(page.language, "strings");
  this.strings = [];
  this.addStrings(stringPage);

  this.fn = (page) ? page.getView() : "index.ejs";

  this.session = req.session;
  this.setLogin((typeof this.session === "undefined") ? {} : this.session.login);

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

  this.page = this.app.findPage(this.path);
};


//
// Strings - translations - etc...
//
Context.prototype.addStrings = function(page, kind) {
  var self = this;
  if (typeof page !== "undefined") {
    page.content.forEach( function (C) {
      if ((typeof kind === "undefined") || (kind === C.kind)) { self.strings[C.name] = C.data; }
    });
  }
};


//
// Render content queried by name or kind.
//
// { kind:     String,
//   not_kind: String,
//   name:     String,
//   not_name: String,
//   intro:    Y/N,     Show intro part?
//   page:     Page }       Optional Page to get the content from instead of current

Context.prototype.render = function(params) {
  var html = "";
  var content = this.page.content;

  if (typeof params === "undefined") {
    params = {};
  }
  if (typeof params.page !== "undefined") {
    content = params.page.content;
  }
  if (typeof content === "undefined") {
    return "";
  }

  for (var ic in content) {
    var C = content[ic];
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

    html += C.render(this.controller);
  }
  return html;
};


//
// login stuff
//

Context.prototype.setLogin = function(login) {
  if (typeof this.session !== "undefined") this.session.login = login;
  this.login = new cody.User(login);
};
Context.prototype.isLoggedIn = function() {
  return (this.login) && (typeof this.login !== "undefined") && (this.login.active === "Y");
};
Context.prototype.getLogin = function() {
  return this.login || new cody.User({});
};


//
// General utilities
//
Context.prototype.getValueByIndex = function(object, index) {
  var nr = 0;
  for (var iO in object) {
    if (nr === index) { return object[iO]; }
    nr++;
  }
  return undefined;
}
Context.prototype.getKeyByIndex = function(object, index) {
  var nr = 0;
  for (var iO in object) {
    if (nr === index) { return iO; }
    nr++;
  }
  return undefined;
}

Context.prototype.val = function(value) {
  return (typeof value === "undefined") ? "" : value;
};

Context.prototype.getUnique = function() {
  return new Date().getTime();
};

// returns 'checked' if true, for option lists.
Context.prototype.checked = function( bool ) {
  return (bool) ? 'checked' : '';
};

//
// Creates html options from a given list
//
// 1. optionList([String], String)
//    Creates an option for each string and marks theId as string.

// 2. optionList([Object], String, String, String)
//    Creates an option for each object, using theIdName and theNameName properties
//    of each object to set the id and html resp.
//
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

//
// optionListF([Any], String, (Any) -> String, (Any) -> String) -> String
//
//    Uses two functions that take an element from the list as argument and return
//    an id/name to create the options. Marks the option that has the id theId as "selected".
//
Context.prototype.optionListF = function (theList, theId, getId, getName) {
  var options = "";
  theList.forEach(function (item) {
    var id = getId(item);
    console.log(id);
    var name = getName(item);
    options += "<option value=\"" + id + "\"" + ((id == theId) ? "selected" : "") + ">" + name + "</option>\n";
  });
  return options;
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
// Session handlers
//

Context.prototype.fromSession = function(paramName, defaultValue) {
  var x = this.session[paramName];
  return (typeof x === "undefined") ? defaultValue : x;
};

Context.prototype.toSession = function(paramName, value) {
  this.session[paramName] = value;
};


//
// Request Parameter handlers
//

Context.prototype.getParam = function(paramName, defaultValue) {
  var x = this.params[paramName];

  if (typeof defaultValue === "boolean") {
    x = (x === "true") || (x === "Y") || (x === "1") || (x === 1);
  };

  if (typeof defaultValue === "number") {
    if ((typeof x === "undefined") || (x === "")) return defaultValue;
    var tmp = parseFloat(x);
    x = (tmp % 1 === 0) ? parseInt(x) : tmp;
  };

  if ((typeof defaultValue !== "undefined") && (defaultValue instanceof Date)) {
    x = this.makeDate(x, defaultValue);
  }

  return (typeof x === "undefined") ? defaultValue : x;
};

Context.prototype.setParam = function(paramName, value) {
  this.params[paramName] = value;
};



// Adds a leading "0" when the number < 10.
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

  if ((typeof aDate === "undefined") || (!aDate)) {
    console.log("formatDate called without date parameter...");
    aDate = new Date();
  }

  if (this.dateFormat === "dd-mm-yyyy") {
    return two(aDate.getDate()) + "-" + two(aDate.getMonth()+1) + "-" + aDate.getFullYear();

  } else if (this.dateFormat === "mm-dd-yyyy") {
    return two(aDate.getMonth()+1) + "-" + two(aDate.getDate()) + "-" + aDate.getFullYear();

  } else { // "yyyy-mm-dd"
    return aDate.getFullYear() + "-" + two(aDate.getMonth()+1) + "-" + two(aDate.getDate());
  }
};

Context.prototype.makeDate = function(value, defaultValue) {
  if (typeof value === "undefined") { return defaultValue; }

  var parts = (value.indexOf("-") > 0) ? value.split("-") : value.split("/");

  if (this.dateFormat === "dd-mm-yyyy") {
    return (parts.length < 3) ?
      defaultValue : new Date(parts[2], parseInt(parts[1], 10)-1, parts[0]);

  } else if (this.dateFormat === "mm-dd-yyyy") {
    return (parts.length < 3) ?
      defaultValue : new Date(parts[2], parseInt(parts[0], 10)-1, parts[1]);

  } else { // "yyyy-mm-dd"
    return (parts.length < 3) ?
      defaultValue : new Date(parts[0], parseInt(parts[1], 10)-1, parts[0]);
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


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

    this.addParamsToContext(context);
  }

  this.context = context;
  context.controller = this;

  this.app = context.app;
  this.connection = (this.app) ? this.app.getConnection() : undefined;

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

  if (! this.hasSubmittedForm(finish)) {
    finish();
  }
};

Controller.prototype.doCrudRequest = function( finish ) {
  var self = this;

  if (self.isRequest("") || this.isRequest("list")) {
    self.doList( finish );

  } else if (self.isRequest("save")) {
    self.doSave( this.getId(), function() {
      self.setRequest("list");
      self.doList( finish );
    });

  } else if (self.isRequest("delete")) {
    self.doDelete( this.getId(), function() {
      self.setRequest("list");
      self.doList( finish );
    });

  } else if (this.isRequest("edit")) {
    self.doGet( this.getId(), finish);

  } else if (this.isRequest("new")) {
    self.doGet( NaN, finish );

  } else {
    return false;
  }

  return true;
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
  return (login) ? login.id : undefined;
};
Controller.prototype.getLoginLevel = function() {
  var login = this.getLogin();
  return (login) ? login.level : 0;
};


Controller.prototype.isAllowed = function( theItemOrPage ) {
  var aUserDomain = this.getLogin().getDomain();
  var anItemDomain = theItemOrPage.getAllowedDomains();

  console.log("Controller.isAllowed: user = '" + aUserDomain + "', item/page(" + theItemOrPage.getId() + ") = '" + anItemDomain + "'");

  // no userdomain -> not allowed
  if (aUserDomain === "") { return false; }

  // user has all rights or belongs to cody admin
  if ((aUserDomain === "*") || (aUserDomain === "cody")) { return true; }

  // item can be edited by any domain or no specific domains are set up
  if ((anItemDomain === "*") || (anItemDomain === "")) { return true; }

  // there is a user domain and the item has 1 of more domain
  // loop through them all and check to see if there is a correspondence
  var aList = anItemDomain.split(",");
  for (var x in aList) {
    if (aList[x]===aUserDomain) {
      return true;
    }
  }

  return false;
};



//
// Form handling
//
Controller.prototype.hasSubmittedForm = function(finish) {
  var self = this;

  // check if a form was submitted (request = send, form-atom = atom.id)
  var atomId = self.getParam("form-atom", 0);

  if ((self.isRequest("send")) && (atomId != 0)) {
    var anAtom = this.app.getAtom(atomId);
    console.log("Controller.doRequest: submitted form = " + atomId + " -> " + anAtom.name);

    // construct a meta data object
    var form = cody.FormController.makeMeta(anAtom, self.page);

    // have the meta object read the values from the submitted params
    form.readValuesFrom(self.context.params, false);
    if (form.ok) {
      // signal if everything was ok and no form is needed again
      self.context.submitted = true;

      // save the values in a database
      form.saveValues(self, "N", finish);

    } else {
      // store the meta object + it's values for re-displaying
      if (typeof self.context.errorForms === "undefined") {
        self.context.errorForms = {};
      }
      // to be used instead of an empty form
      self.context.errorForms[atomId] = form;
      finish();
    }
    return true;
  }
  return false;
};

//
// Session handling
//
Controller.prototype.fromSession = function(paramName, defaultValue) {
  return this.context.fromSession(paramName, defaultValue);
};

Controller.prototype.toSession = function(paramName, value) {
  this.context.toSession(paramName, value);
};

//
// Parameter handling
//
Controller.prototype.getParam = function(paramName, defaultValue) {
  return this.context.getParam(paramName, defaultValue);
};


Controller.prototype.getDate = function(paramName, defaultValue) {
  var x = this.context.getParam(paramName);
  return this.context.makeDate(x, defaultValue);
};

Controller.prototype.makeDate = function(value, defaultValue) {
  return this.context.makeDate(value, defaultValue);
}


Controller.prototype.getInt = function(paramName, defaultValue) {
  var x = this.context.getParam(paramName);
  return this.makeInt(x, defaultValue);
};

Controller.prototype.makeInt = function(value, defaultValue) {
  return this.context.makeInt(value, defaultValue);
}

Controller.prototype.getNum = function(paramName, defaultValue, precision) {
  var x = this.context.getParam(paramName);
  return this.makeNum(x, defaultValue, precision);
};

Controller.prototype.makeNum = function(value, defaultValue, precision) {
  return this.context.makeNum(value, defaultValue);
}


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
Controller.prototype.escape = function(v){
    return this.connection.escape(v);
}

Controller.prototype.closeConnection = function() {
  // console.log("Controller -> done with database connection");

  if (this.connection) {
    this.app.returnConnection(this.connection);
    this.connection = undefined;
  }
};


// General utilities

Controller.prototype.addParamsToContext = function( context ) {
  //TODO: what if there are more than 1 content settings blocks attached?
  var content = context.page.content;
  for (var iC in content) {
    if ((content.hasOwnProperty(iC)) && (content[iC].kind === "P")) {
        context.settings = JSON.parse(content[iC].data);
    }
  }
}

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


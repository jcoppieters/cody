//
// Johan Coppieters - mar 2013 - cody
//
//
console.log("loading " + module.id);

var mysql = require("mysql");
var cody = require("./../index.js");


function UserController(context) {
  console.log("UserController.constructor -> page(" + context.page.itemId + ") = " + context.page.title + ", request = " + context.request);

	// init inherited controller
	cody.Controller.call(this, context);
}

UserController.prototype = Object.create( cody.Controller.prototype );
module.exports = UserController;


UserController.prototype.doRequest = function( finish ) {
  var self = this;


  if (self.isRequest("") || this.isRequest("list")) {
    self.doList( finish );

  } else if (self.isRequest("save")) {
      self.doSave(  this.getId(), function() {
        self.nextRequest("list", finish);
      });

  } else if (self.isRequest("delete")) {
      self.doDelete( this.getId(), function() {
        self.nextRequest("list", finish);
      });

  } else if (this.isRequest("edit")) {
    self.doGet( this.getId(), finish);

  } else if (this.isRequest("new")) {
    self.doGet(NaN, finish);

  } else {
    cody.Controller.prototype.doRequest.call(this, finish);
  }
};



UserController.prototype.doDelete = function( theId, finish ) {
  var self = this;
  
  cody.User.deleteUser(self, theId, function(isOK) {
    if (isOK) {
      self.feedBack(true, "Successfully deleted the user");
    } else {
      self.feedBack(false, "Failed to delete the user");
    }
    finish();
  });
};

	
UserController.prototype.doSave = function( theId, finish ) {
  var self = this;
  cody.User.getUser( self, theId, function(aUser) {
    aUser.scrapeFrom(self);
    aUser.doUpdate(self, function() {
      if (aUser.id === self.getLoginId()) {
        self.setLogin(aUser);
      }
      self.feedBack(true, "Successfully saved the user");
      finish();
    });    
  });
};


UserController.prototype.doGet = function(id, finish) {
  var self = this;
  
  self.doGetRefs( function() {
    if (isNaN(id) || (id <= 0)) {
      self.context.user = new cody.User({id: 0});
      finish();
    } else {
      cody.User.getUser( self, id, function(record) {
        self.context.user = record;
        finish();
      });
    }
  });
};


UserController.prototype.doGetRefs = function(finish) {
  var self = this;
  
  cody.User.getDomains( self, function(list) {
    // also update the list which is kept in the Application object
    self.app.storeDomains(list);
    self.context.domains = self.app.domains;
    
    cody.User.getLevels( self, self.getLoginLevel(), function(list) {
      self.context.levels = list;
      
      finish();
    });
  });
};

UserController.prototype.doList = function(finish) {
  var self = this;
  cody.User.getUsers(self, self.getLoginLevel(), function(list) {
    self.context.users = list;
    
    self.doGetRefs(finish);
  });
};


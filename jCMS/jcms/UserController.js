//
// Johan Coppieters - mar 2013 - jCMS
//
//
console.log("loading " + module.id);

var mysql = require("mysql");
var jcms = require("./index.js");


function UserController(context) {
  // only called for using my methods
  if (typeof context == "undefined") { return; }
  console.log("UserController.constructor -> page(" + context.page.itemId + ") = " + context.page.title + ", request = " + context.request);
  
		
	// use this view for the admin operations
	this.adminView = "cms/users.ejs";
	  
	// init inherited controller
	jcms.Controller.call(this, context);
}

UserController.prototype = Object.create( jcms.Controller.prototype );
module.exports = UserController;



UserController.prototype.doRequest = function( finish ) {
  var self = this;
  
  self.context.fn = this.adminView;
		
  // request for displaying the login screen
  if (self.isRequest("") || this.isRequest("list")) {
    self.doList( finish );
		
  } else if (self.isRequest("save")) {
    self.doSave( this.getInt("id", -1), function() {
      self.setRequest("list");
      self.doList( finish );
    });
      
  } else if (self.isRequest("delete")) {
    self.doDelete( this.getInt("id", -1), function() {
      self.setRequest("list");
      self.doList( finish );
    });
    
  } else if (this.isRequest("edit")) {
    self.doGet( this.getInt("id", -1), finish);
    
  } else if (this.isRequest("new")) {
    self.doGet( NaN, finish );
           
  } else {
   finish();
  }
  
  return null;
};



UserController.prototype.doDelete = function( theId, finish ) {
  var self = this;
  
  jcms.User.deleteUser(self, theId, function(isOK) {
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
  jcms.User.getUser( self, theId, function(aUser) {
    aUser.scrapeFrom(self);
    aUser.doUpdate(self, function() {
      if (aUser.id === self.getLoginId()) {
        self.setLogin(aUser);
      }
      finish();
    });    
  });
};


UserController.prototype.doGet = function(id, finish) {
  var self = this;
  
  self.doGetRefs( function() {
    if (isNaN(id) || (id <= 0)) {
      self.context.user = new jcms.User({id: 0});
      finish();
    } else {
      jcms.User.getUser( self, id, function(record) {
        self.context.user = record;
        finish();
      });
    }
  });
};


UserController.prototype.doGetRefs = function(finish) {
  var self = this;
  
  jcms.User.getDomains( self, function(list) {
    // also update the list which is kept in the Application object
    self.app.storeDomains(list);
    self.context.domains = self.app.domains;
    
    jcms.User.getLevels( self, self.getLoginLevel(), function(list) {
      self.context.levels = list;
      
      finish();
    });
  });
};

UserController.prototype.doList = function(finish) {
  var self = this;
  jcms.User.getUsers(self, self.getLoginLevel(), function(list) {
    self.context.users = list;
    
    self.doGetRefs(finish);
  });
};


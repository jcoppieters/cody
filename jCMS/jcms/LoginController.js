//
// Johan Coppieters - mar 2013 - jCMS
//
//
console.log("loading " + module.id);

var mysql = require("mysql");
var jcms = require("./index.js");

module.exports = LoginController;

function LoginController(context) {
  // only called for using my methods
  if (typeof context == "undefined") { return; }
  console.log("LoginController.constructor -> page(" + context.page.itemId + ") = " + context.page.title + ", request = " + context.request);
  
  
	// view to be used for getting the username/password
	this.loginView = "front/login.ejs";	
		
	// URL used when user logs in and no specific page/action was requested before
	this.loggedInUrl = "/nl";
	// URL used when the user request a log out.
	this.loggedOutUrl = "/nl";
		
	// use this view for the admin operations
	this.adminView = "admin/users.ejs";
	  
	// init inherited controller
	jcms.Controller.call(this, context);
}

// LoginController.prototype = new jcms.Controller(); -- of:
LoginController.prototype = Object.create( jcms.Controller.prototype );

LoginController.prototype.doRequest = function( finish ) {
  var self = this;
  
  self.context.fn = this.adminView;
		
  // request for displaying the login screen
  if (self.request === "") {
    finish( self.loginView );
		
  // request for trying to log in with the given parameters
  } else if (self.request === "login") {
    self.tryLogin( finish );    
    
  } else if (self.request === "logout") {
    self.context.setLogin({});
    var anApp = self.app;
    var aContext = anApp.buildContext( self.loggedOutUrl, self.context.req, self.context.res );
    anApp.handToController(aContext);
    
  }
  /* else if (self.request === "save") {
      self.doSave();
      self.updateLogin();
      self.setRequest("list");
      
  } else if (self.request === "delete")) {
    new TSQL(self, "delete from users where id = ?")
      .setValue(this.getId())
      .execute();
    self.setRequest("list");
  }

  
  if (this.request === "edit")) {
    this.setVar("domains", new TSQL(this, "select distinct domain from users order by domain").getList());
    this.setVar("levels", new TSQL(this, "select id, name from levels order by id").getList());
    this.setVar("user", new TSQL(this, "select * from users where id = ?")
      .setValue( this.getId() )
      .getRecord() );
    return null;
    
  } else if (this.request === "new") {
    this.setVar("domains", new TSQL(this, "select distinct domain from users order by domain").getList());
    this.setVar("levels", new TSQL(this, "select id, name from levels order by id").getList());
    this.setRequest("edit");
    return null;
          
  } else if (this.request === "list") {
    this.setVar("levels", new TSQL(this, "select id, name from levels order by id").getList());
    this.setVar("users", new TSQL(this, this.getUserList()).getList() );
    return null;
    
    
  }*/
  else {
   finish();
  }
  
  return null;
};


LoginController.prototype.markLogin = function( theUserName, theLogin) {
		// override this one if you want to log the login (= ! isActive() -> failed)
    console.log("LoginController.markLogin -> " +
       ((theLogin.isActive()) ? "Login succesful for: " : "Login failed for: ") + theUserName);
};
	
LoginController.prototype.tryLogin = function( finish ) {
  var self = this;  
  var aUserName = self.getParam("username");
  
  // remove login from context and session -> there is no way back...
  self.context.setLogin({});
  
  jcms.User.getUser(self.connection, aUserName, this.getParam("password"), function (aUser) {
      var anApp = self.app;
   
      self.markLogin(aUserName, aUser);
      
      if (aUser.isActive()) {
        self.feedBack(true, "login-successful");
        
        // remember the user in the context and session
        self.context.setLogin(aUser);
        
        // check for pending request from before the login request
        var aSession = self.context.session;
        if (aSession && aSession.pendingContext) {
          console.log("LoginController.tryLogin -> found pending session after login");
          
          // finish current controller, don't render
          finish("");
          
          // hand off control to pending controller and adapt our context, remove pending request
          self.context.copyFromMini(aSession.pendingContext);
          delete aSession.pendingContext;
          anApp.handToController(self.context);
          
        } else {
          console.log("LoginController.tryLogin -> found no pending session after login -> go to 'logged-in page'");

          // no pending request, send to "logged in" page
          var aContext = anApp.buildContext( self.loggedInUrl, self.context.req, self.context.res );
          anApp.handToController(aContext);
        }
        
      } else {
        // failed to login, go back to the same screen
        self.feedBack(false, "login-failed");
        finish(self.loginView);
      }
      
  });
};


LoginController.prototype.updateLogin = function( finish ) {
/* public void updateLogin() {
		int aUser = this.getId();
		TRecord current = (TRecord) this.getVar(TController.kSession, "login");
		if ((current != null) && ((Integer) current.get("id") == aUser)) {
			TRecord aLogin = new TSQL(this, "select * from users where id = ?").setValue(aUser).getRecord();
			this.setLogin(aLogin);
			this.setVar(TController.kSession, "login", aLogin);
		}
*/
};
	
LoginController.prototype.doSave = function( finish ) {
/* public void doSave() {
		if (this.getId() == -1) {
			new TSQL(this, "insert into users (username, password, name, domain, level) values (?,?,?,?,?)")
				.setValue(this.getParam("username"))
				.setValue(this.getParam("password"))
				.setValue(this.getParam("name"))
				.setValue(this.getParam("domain"))
				.setValue(this.getParam("level"))
				.execute();
		} else {
			new TSQL(this, "update users set username = ?, password = ?, name = ?, domain = ?, level = ? where id = ?")
				.setValue(this.getParam("username"))
				.setValue(this.getParam("password"))
				.setValue(this.getParam("name"))
				.setValue(this.getParam("domain"))
				.setValue(this.getParam("level"))
				.setValue(this.getId())
				.execute();
		}
	}
  */
};

//
// Johan Coppieters - mar 2013 - cody
//
//
console.log("loading " + module.id);

var mysql = require("mysql");
var cody = require("./../index.js");


function LoginController(context) {
  console.log("LoginController.constructor -> page(" + context.page.itemId + ") = " + context.page.title + ", request = " + context.request);
  
  
	// view to be used for getting the username/password
	this.loginView = "-/login.ejs";
		
	// URL used when user logs in and no specific page/action was requested before
	this.loggedInUrl = "/" + (context.page.language || context.app.defaultlanguage) + "/dashboard";
	// URL used when the user request a log out.
	this.loggedOutUrl = "/" + (context.page.language || context.app.defaultlanguage);
		
	// use this view for the admin operations
	this.adminView = "-/cms/users.ejs";

	// init inherited controller
	cody.Controller.call(this, context);
}

LoginController.prototype = Object.create( cody.Controller.prototype );
module.exports = LoginController;


// Used to be: LoginController.prototype = new cody.Controller();
// Object.create() is an excellent choice for creating an object without going through its constructor



LoginController.prototype.doRequest = function( finish ) {
  var self = this;
  
  self.context.fn = this.adminView;
		
  if (self.isRequest("")) {
   // request for displaying the login screen
   finish( self.loginView );
		
  } else if (self.isRequest("login")) {
    // request for trying to log in with the given parameters
    self.tryLogin( finish );
 
  } else if (self.isRequest("logout")) {
    // clear login data from the session
    self.setLogin({});

    // redirect internally
    var anApp = self.app;

    var aPath = new cody.Path("/" + self.loggedOutUrl, self.app.defaultlanguage);
    var aContext = anApp.buildContext( aPath, self.context.req, self.context.res );
    anApp.handToController(aContext);    
    
  } else {
   finish();
  }
  
  return undefined;
};


LoginController.prototype.markLogin = function( theUserName, theLogin, locked, finish ) {
  // override this one if you want to log the login (= ! isActive() -> failed)
  // don't forget to call "finish"...
  
  console.log("LoginController.markLogin -> " +
    (theLogin.isActive() ? "Successfully log in for: " : locked ? "User locked: " : "Login failed for: ") +
    theUserName);
    
  finish();
};
	
LoginController.prototype.tryLogin = function( finish ) {
  var self = this;  
  var aUserName = self.getParam("username");
  var locked = false;
  
  // remove login from context and session -> there is no way back...
  self.setLogin({});
  
  cody.User.getUser(self, aUserName, this.getParam("password"), function (aUser) {
    
    console.log("login rec: " + aUserName + " - " + aUser.id + " - " + aUser.badlogins + " - " + aUser.maxbadlogins);
    if (aUser && (aUser.badlogins >= aUser.maxbadlogins)) {
      aUser.active = false;
      locked = true;
    }
   
    self.markLogin(aUserName, aUser, locked, function() {
      if (aUser.isActive()) {
        self.feedBack(true, "login-successful");
        
        // remember the user in the context and session
        self.setLogin(aUser);
        aUser.clearBadLogins(self, function() {
          self.continueRequest( finish );
        });
        
      } else {
        // failed to login, go back to the same screen
        self.feedBack(false, locked ? "login-locked" : "login-failed");
        cody.User.addBadLogin(self, aUserName, function() {
          finish(self.loginView);
        });
      }
      
    });
    
      
  });
};


LoginController.prototype.continueRequest = function(finish) {
  var self = this;
  var anApp = self.app;
  
  //check for pending request from before the login request
  var aSession = self.context.session;
  if (aSession && aSession.pendingContext) {
    console.log("LoginController.tryLogin -> found pending session after login");

    /* we could have Express handle this too, but still some research to do
      request({ url: req.host + req.path, headers: req.headers, body: req.body }, function(err, remoteResponse, remoteBody) {
            if (err) { return res.status(500).end('Error'); }
            res.writeHead(...); // copy all headers from remoteResponse
            res.end(remoteBody);
      });
    */
    
    // hand off control to pending controller and adapt our context, remove pending request
    self.context.copyFromMini(aSession.pendingContext);
    delete aSession.pendingContext;
    anApp.handToController(self.context);
    
  } else {
    // no pending request, send to "logged in" page
    console.log("LoginController.tryLogin -> found no pending session after login -> go to 'logged-in page'");

    // perhaps "loggedInUrl" in login request or take default of this controller.
    var url = self.getParam("loggedInUrl", self.loggedInUrl);

    // used to be internal redirect, now we just let the browser handle everything.
    self.redirect(url);
    finish("");
  }
};


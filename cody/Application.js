//
// Johan Coppieters - jan 2013 - jWorks
//
//

// Next items are also in the issues on BitBucket
//TODO: #1 - drop active from items
//TODO: #1 - rename nr from users to sortorder

//TODO: #2 - use allowdelete, allowinsert of item
//TODO: #3 - set defaultrequest of item somewhere...

var mysql = require('mysql');
var cody = require('./index.js');

var config = require("../config.json");

console.log("loading " + module.id);


function Application(name, version, datapath) {
  this.templates = null;    // hashmap with (id - template)
  this.items = null;        // hashmap with (id - item)
  this.pages = null;        // array with all pages
  this.urls = null;         // hashmap with (urls - page)
  this.atoms = null;        // hashmap with (id - atom)
  this.languages = [];      // array with all languages
  this.domains = null;      // array with all (user) domains
  this.forms = {};          //TODO: hashmap with (id - form) -- or use some stuff from Yanic
  this.controllers = {};    // hashmap with (name - constructor)
    
  this.testing = false;
  this.logging = true;
  this.name = name || config.name;
  this.version = version;
  this.datapath = datapath;

  this.dbuser = config.dbuser || "root";
  this.dbpassword = config.dbpassword || "toor";
  this.dbhost = config.dbhost || "localhost";
  
  this.dumpStructures = true;  
}
module.exports = Application;

// Constants
Application.kDefaultLanguage = "nl";

// Atom roots
Application.kImageRoot = 1;
Application.kFileRoot = 2;

// Content root id's
Application.kNoPage = -1;
Application.kHomePage = 1;
Application.kLoginPage = 2;
Application.kOrphansPage = 3;
Application.kFooterPage = 4;
Application.kDashboardPage = 9;
Application.kGlobalPage = 99;



Application.prototype.init = function() {
  this.getConnection();
  
  this.addControllers();
  
  // daisy chained loading of all CMS elements:
  //   languages, templates, items, pages, forms, ...
  this.fetchStructures();  
};

Application.prototype.addController = function(name, controller) {
  this.controllers[name] = controller;
};

Application.prototype.addControllers = function() {
  //TODO: do this dynamically for all templates[x].controllerName -- Tim ?
  this.addController('Controller', cody.Controller);
  this.addController('ContentController', cody.Controller);
  this.addController('LoginController', cody.LoginController);
  this.addController('UserController', cody.UserController);
  this.addController('PageController', cody.PageController);
  this.addController('ImageController', cody.ImageController);
  this.addController('FileController', cody.FileController);
  this.addController('DashboardController', cody.DashboardController);

};


Application.prototype.err = function(p1, p2, res) {
  console.log("*** error ***");
  this.log(p1, p2);
  
  if (res !== undefined) {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.response.write("404 Not Found\n");
    res.response.end();
  }
};
Application.prototype.log = function(p1, p2) {
  if (this.logging) {
    if (p1 === undefined && p2 === undefined) {
      console.log("Application -> ");
      console.log(this);
      
    } else if (p2 === undefined) {
      console.log(" - " + p1);
      
    } else {
      console.log(p1 + " -> " + p2);
    }
  }
};

Application.prototype.getDataPath = function() {
  return this.datapath;
};

///////////////
// Utilities //
///////////////
Application.endOfTime = function() {
	return new Date(2100,12,31,23,59,59);
};

Application.findFirst = function(theList) {
  var first = null;
  for (var f in theList) { 
    if (theList.hasOwnProperty(f)) {
      first = theList[f]; 
      break; 
    }
  }
  return first;
};

// Daisy chain operators
// - list should be an array
// - iterator is a function that should the passed function when done
//   if it passes an error to the function the loop end here
// - finished is a function that is called when everything is done with no parameter
//   or that is called when the first error occurs
//
// Example:
//   var list = [1, 2, 3, 4, 5];
//   var sum = 0;
//   Application.each(list, function(done) { 
//    sum += this; 
//    done();  // pass an error is something went wrong
//
//   }, function(err) { 
//     // do something with the err if any...
//     console.log("sum = " + sum);
//
//   });

Application.each = function(list, iterator, finished) {
  var nr = list.length;
  function one(current) {
   if (current >= nr) {
     finished();
     
   } else {
     iterator.call(list[current], function(err) {
       if (err) {
         finished(err);
       }
       one(current+1);
     });
   }
  }
  one(0);
};


// Daisy chain functions
// - functionList is a list of functions to be executed
// - each function is executed, with a callback function to be called at the end
// - if this callback is passed an error, the execution is terminated 
//   and the finish function will be called with this error
// - the finish function is called at the end with no error if everything went well
//
// Example:
//  var anObject = { nr: 0 };
//  var aList = [ [anObject, function(done) { this.nr++; done(); }], 
//                [anObject, function(done) { this.nr += 2; done(); }] ];
//  var nr = 0;
//  Application.doList(flist, function(err) { 
//    console.log("error ? " + err + ", total = " + anObject.nr); 
//  });
//
Application.doList = function(functionList, finished) {
  var nr = functionList.length;
  function one(current) {
   if (current >= nr) {
     if (typeof finished === "function") { finished(); }
     
   } else {
     var entry = functionList[current];
     entry[1].call( entry[0], function(err) {
       if (err) {
         if (typeof finished === "function") { finished(err); }
       }
       one(current+1);
     });
   }
  }
  one(0);
};

//////////////////
// Page serving //
//////////////////
Application.prototype.servePage = function(req, res) {
  var self = this;
   
  // get url path, strip leading '/'
  var path = req._parsedUrl.pathname.substring(1);
  self.log("------------------------------------------------------------------- " + new Date() + "--");
  self.log("servePage - path -> " + path);
  
   
  var aContext = this.buildContext( path, req, res );
  self.handToController(aContext);
};

Application.prototype.buildContext = function (path, req, res) {
  var self = this;
  
  // get the page
  var language = self.findLanguage(path);
  var page = self.findPage(path, language);
  
  if (page === null) {
      self.err("servePage", "No page found for path = " + path + " & language = " + language, res);
      return null;
  }

  self.log("servePage -> page", page.language + "/" + page.itemId + " - " + page.title);
  
  // build a context
  var context = new cody.Context(path, page, self, req, res);
  console.log("servePage - params -> ");  console.log(context.params);
  console.log("servePage - session -> "); console.log(context.session);
  console.log("servePage - files -> ");   console.log(req.files);
  return context;
};

Application.prototype.handToController = function(context) {
  var self = this;
  
  // make a controller and send it 'doRequest'
  self.log("handToController", context.page.item.template.controllerName);
  var controller = context.page.getController(context);
  
  if (controller === null) {
    self.err("handToController", "No controller found for " + context.page.item.template.controllerName);
    return;
  }
  
  // check if authentication is required for this action
  //  and if so and not yet done: store this action and perform login first
  if (controller.needsLogin()) {
    if (controller.isLoggedIn()) {
      self.log("http get - check login", "already logged in");
    } else {
      self.log("http get - check login", "needs login, redirect/remember");
      
      self.logInFirst(context);
      return;
    }
  }
  
  controller.doRequest( function(fn, header) {
    // calback function should always be called by doRequest
    //  render with given or the template in the context (controller may have changed it)
    //  if no render template present ( == "") either
    //    -- assume the controller performed res.writeHead() / .write() / .end() -- ajax req?
    //    -- another controller has taken over

    if (typeof fn == "object") {
      controller.gen(fn, header);
      
    } else {
      if (typeof fn != "undefined") { 
        context.fn = fn; 
      }
      
      self.log("Application.handToController -> finish - template file = ", (context.fn==="") ? "** none **" : context.fn);
      if (context.fn !== "") {
        context.res.render("../views/" +context.fn, context);
      }
    }
      
    controller.close();
  });
};

Application.prototype.logInFirst = function(context) {
  var self = this;
  var req = context.req;
  
  // copy minimal version of the context to our session
  req.session.pendingContext = context.getMini();
  
  // build context and make LoginController
  var aContext = self.buildContext( context.page.language + "/login", req, context.res );
  self.handToController(aContext);
};

/////////////////
// SQL support //
/////////////////
Application.prototype.getConnection = function() {
  
  if (typeof this.connection === "undefined") {
    this.log("Application", "Make new Connection");
    
    //TODO: read from config file
    // https://github.com/felixge/node-mysql
    this.connection = mysql.createConnection({
        host: this.dbhost,
        user: this.dbuser, password: this.dbpassword,
        database: this.name
    });
  } else {
    this.log("Application.getConnection", "Returning existing connection");
  }
  
  if (typeof this.connection === "undefined") {
    throw(new Error("Fatal error: No database connection"));
  }
  return this.connection;
};

Application.prototype.returnConnection = function( connection ) {
  // Do nothing: we only have 1 connection and we don't close it in between requests...
  
};

///////////////////////////////////////////
// Fetch all structured data into memory //
///////////////////////////////////////////
Application.prototype.fetchStructures = function() {
  var self = this;
  Application.doList([
    [self, Application.prototype.fetchLanguages],
    [self, Application.prototype.fetchAtoms],
    [self, Application.prototype.fetchTemplates],
    [self, Application.prototype.fetchItems],
    [self, Application.prototype.fetchPages],
    [self, Application.prototype.fetchForms],
    [self, Application.prototype.fetchDomains]
  ], function(err){
    if (err) {
      self.log("fetchStructures", "!! some of our loading functions failed !!");
    } else {
      self.log("fetchStructures", "finished loading the database structures");
      if (self.dumpStructures) { self.dump(); }
    }
  });
};

///////////////
// Languages //
///////////////
Application.prototype.fetchLanguages = function(done) {
  var self = this;
  
  cody.Page.loadLanguages(this.connection, function(result) {
    for (var i in result) {
      if (result.hasOwnProperty(i)) { self.languages.push(result[i]); }
    }
    self.log("Application.fetchLanguages", "fetched " + result.length + " languages");
    
    // next step
    done();
  });
};

Application.prototype.getLanguages = function() {
	return this.languages;
};
Application.prototype.isDefaultLanguage = function(language) {
  return language == Application.kDefaultLanguage;
};
Application.prototype.findLanguage = function(url) {
  var i = url.indexOf("/");
  return (i > 0) ? url.substring(0, i) : Application.kDefaultLanguage;
};


///////////
//Atoms //
///////////
Application.prototype.getAtom = function(id) {
  return this.atoms[id];
};

Application.prototype.addAtom = function(atom) {
  this.atoms[atom.id] = atom;
  atom.app = this;
};

Application.prototype.hasAtomChildren = function(parent) {
  for (var i = 0; i < this.atoms.length; i++) {
    if  (this.atoms[i].id == parent.id) {
      return true;
    }
  }
  return false;
};
Application.prototype.getAtomChildren = function(parent) {
  var self = this;
  var list = [];
  for (var i in this.atoms) {
    var anAtom = self.atoms[i];
    if (parent.isChild(anAtom)) {
      list.push(anAtom);
    }
  }
  list.sort( function(a, b) { return a.sortorder - b.sortorder; });
  return list;
};

Application.prototype.fetchAtoms = function(done) {
  var self = this;

  //fetch all atoms
  cody.Atom.loadAtoms(self.connection, function(result) {
    self.atoms = {};
    for (var i = 0; i < result.length; i++) {
      self.addAtom(new cody.Atom(result[i]));
    }
    self.log("Application.fetchAtoms", "fetched " + result.length + " atoms");

    // next step
    done();
  });
};


///////////////
// Templates //
///////////////
Application.prototype.getTemplate = function(templateId) {
  return this.templates[templateId];
};
Application.prototype.fetchTemplates = function(done) {
  var self = this;
  
  cody.Template.loadTemplates(this.connection, function(result) {
    self.templates = {};
    for (var i = 0; i < result.length; i++) {
      // make an Template object of our data
      var O = new cody.Template(result[i], self.controllers);
      
      // store under its id
      self.templates[O.id] = O;
    }
    self.log("Application.fetchTemplates", "fetched " + result.length + " templates");
    
    // next step
    done();
  });
};


///////////
// Items //
///////////
Application.prototype.getItem = function(itemId) {
  return this.items[itemId];
};
Application.prototype.attachItemChildren = function() {
  // loop through all items and attach their parent
  for (var i in this.items) {
    // let the page itself pick from the list
    this.items[i].pickParent(this.items);
  }
};

Application.prototype.addItem = function(anItem) {
  var self = this;
  
	self.items[anItem.id] = anItem;
	anItem.pickParent(this.items);
  self.log("Application.addItem", "added " + anItem.id + " / " + anItem.name);
};

Application.prototype.fetchItems = function(done) {
  var self = this;
  
  cody.Item.loadItems(this.connection, function(result) {
    // make hashtable on item id
    self.items = {};
    
    for (var i = 0; i < result.length; i++) {
      // make an Item object of our data
      var O = new cody.Item(result[i], self);
      
      // store under its id
      self.items[O.id] = O;
    }
    self.attachItemChildren();

    self.log("Application.fetchItems", "fetched " + result.length + " items");
    // console.log(self.items);
    
    // next step
    done();
  });
};


///////////
// Pages //
///////////
Application.prototype.getPageLink = function(path) {
  var pos = path.indexOf("/");
  if (pos < 0) { return path; }
  
  pos = path.indexOf("/", pos+1);
  if (pos < 0) { return path; }
  
  return path.substring(0, pos); 
};

Application.prototype.getSubDomain = function(path) {
  var pos = path.indexOf("/");
  if (pos < 0) { return ""; }
  
  pos = path.indexOf("/", pos+1);
  if (pos < 0) { return ""; }
  
  return path.substring(pos+1);
};

Application.prototype.getPage = function(languageOrLink, itemId) {
  if (typeof itemId == "undefined") {
    return this.urls[languageOrLink];
  } else { 
    return this.urls[languageOrLink+"/"+itemId];
  }
};

Application.prototype.findPage = function(path, language) {
  // Use only language/domain
  var pageLink = this.getPageLink(path);
  var aPage = this.urls[pageLink];
  
  // if page not found -> serve the language/notfound page
  if (typeof aPage === "undefined") {
    aPage = this.urls[language + "/notfound"];
  }
  
  // if no notfound-page -> try to serve the home page
  if (typeof aPage === "undefined") {
    aPage = this.urls[language + "/welcome"];
    console.log("Application.findPage - " + language + "/welcome");
  }
  
  if (typeof aPage !== "undefined") {
    aPage = aPage.getDisplay();
  }
  
  return aPage;
};

Application.prototype.genRoots = function() {
  // loop through all pages and lookup its 'toplevel' (root)
  for (var i in this.pages) {
    this.pages[i].addRoot();
  }  
};

Application.prototype.attachChildrenToPages = function() {
  // loop through all pages and attach their children
  for (var i in this.pages) {
    // let the page itself pick from the list
    this.pages[i].addChildren(this.pages);
  }
};

Application.prototype.buildSitemap = function() {
  this.attachChildrenToPages();
  this.genRoots();
};

Application.prototype.addPage = function(page) {
	page.addTo(this);
	this.buildSitemap();
};

Application.prototype.fetchPages = function(done) {
  var self = this;
  
  cody.Page.loadPages(self.connection, function(result) {
    self.pages = [];
    self.urls = {};
    
    Application.each(result, function(nextOne) {
      
      var onePage = new cody.Page(this, self);
      self.log("Application.fetchPages", onePage.title);
      
      onePage.addTo(self);
      onePage.loadContent(self, nextOne);

    }, function(err) { 
      self.buildSitemap();
      
      self.log("Application.fetchPages", "fetched " + result.length + " pages");
      
      // next step
      done();
    });
  });
};

Application.prototype.deletePagesForItem = function( itemId, finish ) {
  var self = this;
  
  // delete the pages in every language from the url hashmap
  for (var i in self.languages) {
    var lan = self.languages[i].id;
    var P = self.getPage(lan, itemId);
    delete self.urls[lan+"/"+itemId];
    if (P.link !== "") {
      delete self.urls[lan+"/"+P.link];
    }
  }
  
  // delete the page from the pages array
  // by rebuilding the array while omitting the pages
  var newList = [];
  for (var p in this.pages) {
    if (self.pages[p].itemId != itemId) {
      newList.push(self.pages[p]);
    }
  }
  self.pages = newList;
  
  // rebuild the tree structure
  self.buildSitemap();
  
  finish();
};

Application.prototype.dump = function() {
  var self = this;
  var cnt = 0;
  
  function printPage(lan, id) {
    var p = self.getPage(lan, id);
    if (p) {
      console.log(" " + p.shortString());
    } else {
      console.log(" ** missing page **");
    }
  }

  function printLevel(r, nr) {
    var tab = "";
    for (var i=0; i<nr; i++) { tab = tab + " "; }

    for(var p in r) {
      console.log(tab + r[p].shortString());
      cnt += r[p].contentLength();
      printLevel(r[p].children, nr+2);
    }
  }
  function printChildren(lan, id) {
    console.log("- " + lan + " -");
    var p = self.getPage(lan, id);
    printLevel(p.getChildren() , 1);
  }
 
  console.log("--- Controllers ---");
  for (var c in self.controllers) {
    console.log(c);
  }
  
  console.log("\n--- Homepages ---");
  self.languages.forEach( function(lan) { printChildren(lan.id, Application.kHomePage); });
  
  console.log("\n--- Dashboard ---");
  self.languages.forEach( function(lan) { printChildren(lan.id, Application.kDashboardPage); });
  
  console.log("\n--- Footers ---");
  self.languages.forEach( function(lan) { printChildren(lan.id, Application.kFooterPage); });
  
  console.log("\n--- Pages ---");
  self.languages.forEach( function(lan) { printChildren(lan.id, Application.kOrphansPage); });
  
  console.log("\n--- Globals ---");
  self.languages.forEach( function(lan) { printPage(lan.id, Application.kGlobalPage); });
  
  console.log("\n--- Logins ---");
  self.languages.forEach( function(lan) { printPage(lan.id, Application.kLoginPage); });

  
  console.log("\n----------------");
  console.log("Total content: " + cnt + " bytes");
  console.log("----------------");
};


///////////
// forms //
///////////
Application.prototype.getForm = function(formId) {
  return {};
  //TODO: read forms from the database...
  // return this.forms[formId];
};
Application.prototype.fetchForms = function(done) {
   var self = this;
  
   // fetch all forms
  
   // next step
   done();
};


/////////////////////
//Users - Domains //
/////////////////////
Application.prototype.fetchDomains = function(done) {
  var self = this;
  
  // fetch all user domains
  cody.User.getDomains(self.connection, function(result) {
    self.storeDomains(result);
    self.log("Application.fetchDomains", "fetched " + result.length + " domains");
    
    // next step
    done();
  });
};

Application.prototype.storeDomains = function(result) {
  var self = this;
  self.domains = [];
  for (var i = 0; i < result.length; i++) {
    self.domains.push(result[i].domain);
  }
};


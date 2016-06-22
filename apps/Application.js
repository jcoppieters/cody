//
// Johan Coppieters - jan 2013 - jWorks
//
//


var mysql = require('mysql');
// JM: assuming Application is always require()'d directly by cody/index.js since ../../index.js is ugly.
// maybe replace in all other files as well.
var cody = module.parent.exports;

console.log("loading " + module.id);


function Application(config) {
  this.templates = {};      // hashmap with (id - template)
  this.items = {};          // hashmap with (id - item)
  this.pages = [];          // array with all pages
  this.urls = {};           // hashmap with (urls - page)
  this.atoms = {};          // hashmap with (id - atom)
  this.languages = [];      // array with all languages
  this.domains = [];        // array with all (user) domains
  this.controllers = {};    // hashmap with (name - constructor)
    
  this.testing = config.testing || config.testing || false;
  this.logging = config.logging || config.logging || true;

  this.defaultlanguage = config.defaultlanguage || config.defaultlanguage || Application.kDefaultLanguage;
  Application.kDefaultLanguage = this.defaultlanguage;

  //TODO: don't we have to return errors if some of these are missing ?
  this.name = config.name || "cody";
  this.version =  config.version || "v1.0";
  this.datapath =  config.datapath || "./data";

  this.dbuser = config.dbuser || "cody";
  // allowing empty password, thanks linksgo2011 & ticup (changed also in template startup file: doc/empty/index.js)
  this.dbpassword = (typeof config.dbpassword === "undefined") ? "ydoc" : config.dbpassword;
  this.dbhost = config.dbhost || "localhost";
  this.dbport = config.dbport || 3306;
  this.db = config.db || "cody";
  this.smtp = config.smtp || "smtp.telenet.be";
  this.smtpoptions = config.smtpoptions; // see https://github.com/andris9/Nodemailer
  this.mailFrom = config.mailFrom || "info@cody-cms.org";

  this.dumpStructures = config.dumpstructures || true;
  if (this.logging) {
    console.log(this);
  }
}
module.exports = Application;

// Constants
Application.kDefaultLanguage = "en";

// Atom roots
Application.kImageRoot = 1;
Application.kFileRoot = 2;
Application.kFormRoot = 3;

// Content root id's
Application.kNoPage = -1;
Application.kHomePage = 1;
Application.kLoginPage = 2;
Application.kOrphansPage = 3;
Application.kFooterPage = 4;
Application.kDashboardPage = 9;
Application.kGlobalPage = 99;



Application.prototype.init = function( done ) {
  var self = this;

  self.getConnection();

  self.addControllers();
  
  // daisy chained loading of all CMS elements:
  //   languages, templates, atoms, items, pages with content,...
  self.fetchStructures( done );
};

Application.prototype.addController = function(name, controller) {
  var self = this;

  self.controllers[name] = controller;
};

Application.prototype.addControllers = function() {
  var self = this;
  var path = require('path')

  // add all controllers in the controller directory of cody
  // JM: module.parent = the invoking cody; its parent is the running
  // web app's module (user code).
  // note that path.resolve confuses the filename at the end of the
  // module path with a directory, so we need extra .. to refer to
  // the directory it is in.
  require("fs").readdirSync(path.resolve(module.parent.filename, '..', 'controllers/')).forEach(function(file) {
    var ctl = require(path.resolve(module.parent.filename, '..', 'controllers', file));
    self.addController(ctl.name, ctl);
  });


  // add alias 'ContentController' of 'Controller'
  self.addController("ContentController", self.controllers["controller"]);
 };


Application.prototype.err = function(p1, p2, res) {
  var self = this;

  console.log("*** error ***");
  self.log(p1, p2);
  
  if (typeof res !== "undefined") {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.write("404 Not Found\n");
    res.end();
  }
};
Application.prototype.log = function(p1, p2) {
  var self = this;

  if (self.logging) {
    if (typeof p1 === "undefined" && typeof p2 === "undefined") {
      console.log("Application -> ");
      console.log(this);
      
    } else if (typeof p2 === "undefined") {
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
  var first = undefined;
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
// - iterator is a function that should call the passed function when done
//   if it passes an error to the function the loop ends here
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
  var path = new cody.Path(req._parsedUrl.pathname, self.defaultlanguage);

  var ip = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
  console.log("--LOG--A--|" + ip + "|" + new Date() + "|" + req.headers['host'] + "|" + req._parsedUrl.pathname);

  self.log("servePage - path -> " + path.link);
  
   
  var aContext = self.buildContext( path, req, res );
  if (typeof aContext !== "undefined") {
    self.handToController(aContext);
  }
};


Application.prototype.buildContext = function (path, req, res) {
  var self = this;
  
  // get the page
  var page = self.findPage(path);
  
  if (typeof page === "undefined") {
      self.err("servePage", "No page found for path = " + path.pagelink, res);
      return undefined;
  }

  self.log("buildContext -> page", page.language + "/" + page.itemId + " - " + page.title);
  
  // build a context
  var context = new cody.Context(path, page, self, req, res);
  console.log("servePage - params -> "); console.log(context.params);
  console.log("servePage - session -> "); console.log(context.session);

  if (typeof req.files !== "undefined") { console.log("servePage - files -> "); console.log(req.files); }

  return context;
};

Application.prototype.handToController = function(context) {
  var self = this;
  
  // make a controller and send it 'doRequest'
  self.log("handToController", context.page.item.template.controllerName);
  var controller = context.page.getController(context);
  
  if (typeof controller === "undefined") {
    self.err("handToController", "No controller found for " + context.page.item.template.controllerName);
    return;
  }
  
  // check if authentication is required for this action
  //  and if so and not yet done: store this action and perform login first
  if (controller.needsLogin()) {
    if (controller.isLoggedIn()) {
      self.log("Application - check login", "already logged in");
      if (! controller.isAllowed(context.page)) {
        controller.close();
        self.notAllowed(context);
        return;
      }
    } else {
      self.log("Application - check login", "needs login, redirect/remember");

      controller.close();
      self.logInFirst(context);
      return;
    }
  }
  
  controller.doRequest( function(fn, header) {
    // callback function should always be called by doRequest
    //  render with the specified or the template in the context (controller may have changed it)
    //  if no render template present ( == "") either
    //    -- assume the controller performed res.writeHead() / .write() / .end() -- ajax req?
    //    -- another controller has taken over

    if (typeof fn === "object") {
      controller.gen(fn, header);
      
    } else {
      if (typeof fn !== "undefined") {
        context.fn = fn; 
      }
      
      self.log("Application.handToController -> finished -> render view", (context.fn==="") ? "** none **" : context.fn);

      self.renderView( context );
    }
      
    controller.close();
  });
};

Application.prototype.renderView = function( context ) {
  var self = this;
  var path = require("path");

  if (context.fn === "") {
    return;
  }

  // cody views can be used by starting the pathname with "-/"
  var i = context.fn.indexOf("-/");

  // default root path for rendering in Express = [project]/views/
  // JM: module.parent = the invoking cody; its parent is the running
  // web app's module (user code).
  // note that path.resolve confuses the filename at the end of the
  // module path with a directory, so we need extra .. to refer to
  // the directory it is in.
  var viewfile = (i === 0) ?
      path.resolve(module.parent.filename, "..", "views", context.fn.substring(2)) :
      path.resolve(module.parent.parent.filename, "..", self.name, "views", context.fn);

  self.log("Application.renderView", viewfile);
  context.res.render(viewfile, context);
};

// internal redirect = delegate
Application.prototype.delegate = function(context, redirectTo) {
  var self = this;

  // either [language]/itemlink or itemlink
  var newURL = (redirectTo.indexOf("/") != 2) ? context.page.language + "/" + redirectTo : redirectTo;
  var aPath = new cody.Path(newURL, self.defaultlanguage);
  var aContext = self.buildContext( aPath, context.req, context.res );
  self.handToController(aContext);
};

Application.prototype.logInFirst = function(context) {

  // copy minimal version of the context to our session
  context.req.session.pendingContext = context.getMini();

  this.delegate(context, "login");
};

Application.prototype.notAllowed = function(context) {
  this.delegate(context, "notallowed");
};


/////////////////
// SQL support //
/////////////////
Application.prototype.getConnection = function() {
  var self = this;

  if (typeof self.connection === "undefined") {
    self.log("Application", "Make new Connection");
    
    // https://github.com/felixge/node-mysql
    self.connection = mysql.createConnection({
        host: self.dbhost, port: self.dbport,
        user: self.dbuser, password: self.dbpassword,
        database: self.db
    });
  } else {
    self.log("Application.getConnection", "Returning existing connection");
  }
  
  if (typeof self.connection === "undefined") {
    throw(new Error("Fatal error: No database connection"));
  }
  return self.connection;
};

Application.prototype.returnConnection = function( connection ) {
  // Do nothing: we only have 1 connection and we don't close it in between requests...
  
};

///////////////////////////////////////////
// Fetch all structured data into memory //
///////////////////////////////////////////
Application.prototype.fetchStructures = function( done ) {
  var self = this;

  Application.doList([
    [self, Application.prototype.fetchLanguages],
    [self, Application.prototype.fetchAtoms],
    [self, Application.prototype.fetchTemplates],
    [self, Application.prototype.fetchItems],
    [self, Application.prototype.fetchPages],
    [self, Application.prototype.fetchDomains]
  ], function(err){
    if (err) {
      self.log("fetchStructures", "!! some of our loading functions failed !!");
    } else {
      self.log("fetchStructures", "finished loading the database structures");
      if (self.dumpStructures) { self.dump(); }
      if (typeof done === "function") { done (); }
    }
  });
};

///////////////
// Languages //
///////////////
Application.prototype.fetchLanguages = function(done) {
  var self = this;
  
  cody.Page.loadLanguages(self.connection, function(result) {
    for (var i in result) {
      if (result.hasOwnProperty(i)) {
        self.languages.push(result[i]);
        if (typeof self.defaultlanguage === "undefined") self.defaultlanguage = result[i].id;
      }
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
  return language === this.defaultlanguage;
};


///////////
//Atoms //
///////////
Application.prototype.getAtom = function(id) {
  return this.atoms[id];
};

Application.prototype.addAtom = function(atom) {
  var self = this;

  self.atoms[atom.id] = atom;
  atom.app = self;
};

Application.prototype.hasAtomChildren = function(parent) {
  var self = this;

  for (var i = 0; i < self.atoms.length; i++) {
    if  (self.atoms[i].parent === parent.id) {
      return true;
    }
  }
  return false;
};
Application.prototype.getAtomChildren = function(parent) {
  var self = this;

  var list = [];
  for (var i in self.atoms) {
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
  
  cody.Template.loadTemplates(self.connection, function(result) {
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

Application.prototype.templateUsed = function(templateId) {
  var found = false;

  for (var it in this.items) {
    if (this.items[it].templateId == templateId) {
      return true;
    }
  }
  return false;
};

Application.prototype.deleteTemplate = function(templateId) {
  var self = this;

  var aTemplate = self.templates[templateId];
  if (typeof aTemplate !== "undefined") {
    delete self.templates[templateId];
  }
  return aTemplate;
};

///////////
// Items //
///////////
Application.prototype.getItem = function(itemId) {
  return this.items[itemId];
};
Application.prototype.attachItemChildren = function() {
  var self = this;

  // loop through all items and attach their parent
  for (var i in self.items) {
    // let the page itself pick from the list
    self.items[i].pickParent(self.items);
  }
};

Application.prototype.addItem = function(anItem) {
  var self = this;
  
	self.items[anItem.id] = anItem;
	anItem.pickParent(self.items);
  self.log("Application.addItem", "added " + anItem.id + " / " + anItem.name);
};

Application.prototype.fetchItems = function(done) {
  var self = this;
  
  cody.Item.loadItems(self.connection, function(result) {
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
Application.prototype.getPage = function(languageOrLink, itemId) {
  var self = this;

  var link = languageOrLink;
  if (typeof itemId !== "undefined") {
    link += "/"+itemId;
  }
  return self.urls[link];
};

Application.prototype.findPage = function(path) {
  var self = this;

  // hash based on only language/domain

  // if only language is specified (can be the defaultlanguage), serve the welcome/home page
  var aPage = self.urls[path.pagelink + ((path.domain === "") ? "welcome" : "")];
  
  // if page not found -> serve the language/notfound page
  if (typeof aPage === "undefined") {
    console.log("Application.findPage - not found -> " + path.pagelink + ", trying -> " + path.language + "/notfound");
    aPage = self.urls[path.language + "/notfound"];
  }

  if (typeof aPage !== "undefined") {
    aPage = aPage.getDisplay();
  }
  
  return aPage;
};


Application.prototype.genRoots = function() {
  var self = this;

  // loop through all pages and lookup its 'toplevel' (root)
  for (var i in self.pages) {
    self.pages[i].addRoot();
  }  
};


Application.prototype.attachChildrenToPages = function() {
  var self = this;

  // loop through all pages and attach their children
  for (var i in self.pages) {
    // let the page itself pick from the list
    self.pages[i].addChildren(self.pages);
  }
};


Application.prototype.buildSitemap = function() {
  var self = this;

  self.attachChildrenToPages();
  self.genRoots();
};


Application.prototype.addPage = function(page) {
  var self = this;

  page.addTo(self);
	self.buildSitemap();
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
  for (var p in self.pages) {
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


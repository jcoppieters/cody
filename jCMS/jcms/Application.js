//
// Johan Coppieters - jan 2013 - jWorks
//
//
var mysql = require('mysql');
var jcms = require('./index.js');

console.log("loading " + module.id);

module.exports = Application;

function Application(name, version) {
  this.roots = [];          // array with all pages having parent = 0
  this.admins = [];         // array with all pages having parent = -1
  this.globals = [];        // array with all pages having parent = -2
  
  this.templates = null;    // hasmap with (id - template)
  this.items = null;        // hasmap with (id - item)
  this.pages = null;        // array with all pages
  this.urls = null;         // hashmap with (urls - page)
  this.languages = null;    // array with all languages
  this.domains = null;      // array with all (user) domains
  this.forms = {};    		//TODO: hasmap with (id - form)
  this.controllers = {};    // hashmap with (name - constructor)
    
  this.testing = false;
  this.logging = true;
  this.name = name;
  this.version = version;
  this.defaultLanguage = "nl";
  
  this.dumped = false;
}

Application.prototype.init = function() {
  var connection = this.getConnection();
  
  this.addControllers();
  
  // daisy chained loading of all CMS elements:
  //   languages, templates, items, pages, forms, ...
  this.fetchStructures(connection);
};

Application.prototype.addController = function(name, controller) {
  this.controllers[name] = controller;
};

Application.prototype.addControllers = function() {
  // do this dynamically for all templates[x].class -- Tim ?
  this.addController('Controller', jcms.Controller);
  this.addController('LoginController', jcms.LoginController);
  this.addController('SitemapController', jcms.SitemapController);
  
  // add compatibility with rWorks (todo: sitemap, imagetree, filetree, formtree, system)
  this.addController('rWorks.TContentController', jcms.Controller);
  this.addController('rWorks.TLoginController', jcms.LoginController);
  this.addController('rWorks.TSitemapController', jcms.SitemapController);
};


Application.prototype.err = function(p1, p2, res) {
  console.log("*** error ***");
  this.log(p1, p2);
  
  if (res != undefined) {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.response.write("404 Not Found\n");
    res.response.end();
  }
};
Application.prototype.log = function(p1, p2) {
  if (this.logging) {
    if (p1 == undefined && p2 == undefined) {
      console.log("Application -> ");
      console.log(this);
      
    } else if (p2 == undefined) {
      console.log(" - " + p1);
      
    } else {
      console.log(p1 + " -> " + p2);
    }
  }
};



//////////////////
// Page serving //
//////////////////
Application.prototype.servePage = function(req, res) {
  var self = this;
  
  // can't do this in the init phase
  // if (! this.dumped) this.dump();
 
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
  
  	if (page == null) {
  		self.err("servePage", "No page found for path = " + path + " & language = " + language, res);
  		return null;
  	}
  	
	self.log("servePage -> page", page.language + "/" + page.itemId + " - " + page.title);
	
	// build a context
	var context = new jcms.Context(path, page, self, req, res);
	console.log("servePage - params -> ");  console.log(context.params);
	console.log("servePage - session -> "); console.log(context.session);
	return context;
};

Application.prototype.handToController = function(context) {
  var self = this;
  
  // make a controller and send it 'doRequest'
  self.log("handToController -> controller", context.page.item.template.class);
  var controller = context.page.getController(context);
  
  if (controller == null) {
    self.err("handToController", "No controller found for " + context.page.item.template.class, res);
    return;
  }
  
  // check if authentication is required for this action
  //  and if so and not yet done: store this action and perform login first
  if (controller.needsLogin()) {
    if (context.session.login) {
      self.log("http get - check login", "already logged in");
    } else {
      self.log("http get - check login", "needs login, redirect/remember");
      
      self.logInFirst(context);
      return;
    }
  }
  
  controller.doRequest( function(fn) {
    // should always be called by doRequest
    //  render with given or the template in the context (controller may have changed it)
    //  if no render template present ( == "") either
    //    -- assume the controller performed res.writeHead() / .write() / .end() -- ajax req?
    //    -- another controller has taken over

    if (typeof fn != "undefined") context.fn = fn;
    
    self.log("finish - template file", context.fn);
    if (context.fn != "") {
      context.res.render(context.fn, context);
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
  this.log("Application", "getConnection");
 
 //TODO: read from config file
  return mysql.createConnection({
      host: 'localhost',
      user: 'root', password: 'Jd2qqNAt',
      database: this.name
  });
};

///////////////
// Languages //
///////////////
Application.prototype.fetchStructures = function(connection) {
  var self = this;
  
  connection.query('select * from languages order by sortorder', [], function(err, result) {
    self.languages = result;
    self.log("Application.fetchLanguages", "fetched " + result.length + " languages");
    
    // next step
    self.fetchTemplates(connection);
  });
};

Application.prototype.findLanguage = function(url) {
  var i = url.indexOf("/");
  return (i > 0) ? url.substring(0, i) : this.defaultLanguage;
};

///////////////
// Templates //
///////////////
Application.prototype.getTemplate = function(templateId) {
  return this.templates[templateId];
};
Application.prototype.fetchTemplates = function(connection) {
  var self = this;
  
  connection.query('select * from templates', [], function(err, result) {
    self.templates = {};
    for (var i = 0; i < result.length; i++) {
      // make an Template object of our data
      var O = new jcms.Template(result[i], self.controllers);
      
      // store under its id
      self.templates[O.id] = O;
    }
    self.log("Application.fetchTemplates", "fetched " + result.length + " templates");
    
    // next step
    self.fetchItems(connection);
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

Application.prototype.fetchItems = function(connection) {
  var self = this;
  
  connection.query('select * from items', [], function(err, result) {
    // make hashtable on item id
    self.items = {};
    
    for (var i = 0; i < result.length; i++) {
      // make an Item object of our data
      var O = new jcms.Item(result[i], self);
      
      // store under its id
      self.items[O.id] = O;
    }
    self.attachItemChildren();

    self.log("Application.fetchItems", "fetched " + result.length + " items");
    // console.log(self.items);
    
    // next step
    self.fetchPages(connection);
  });
};


///////////
// Pages //
///////////
Application.prototype.getPageLink = function(path) {
	var pos = path.indexOf("/");
	if (pos < 0) return path;
	
	var pos = path.indexOf("/", pos+1);
	if (pos < 0) return path;
	
	return path.substring(0, pos); 
};
Application.prototype.getSubDomain = function(path) {
	var pos = path.indexOf("/");
	if (pos < 0) return "";
	
	var pos = path.indexOf("/", pos+1);
	if (pos < 0) return "";
	
	return path.substring(pos+1); 
};

Application.prototype.findPage = function(path, language) {
  // only keep language/domain
  //TODO: split off!!

  var pageLink = this.getPageLink(path);
  var aPage = this.urls[pageLink];
  
  // if page not found -> serve the language/notfound page
  if (aPage == null) {
    aPage = this.urls[language + "/notfound"];
  }
  
  // if no notfound-page -> try to serve the home page
  if (aPage == null) {
    aPage = this.urls[language + "/welcome"];
    console.log("Application.findPage - " + language + "/welcome");
  }
  
  if (aPage != null)
    aPage = aPage.getDisplay();
  
  return aPage;
};

Application.prototype.genSpecials = function() {
  // loop through all pages
  //   - put in 'roots' (parent = 0) or 'admin' (parent = -1) or 'global' (parent = -2)
  //   - lookup for each page its 'toplevel' (root)
  for (var i in this.pages) {
    var p = this.pages[i];
    if (p.item.parentId ==  0) this.roots.push(p);
	//TODO: remove compatibility mode with rWorks -> delete the < 50 !
    if ((p.item.parentId == -1) && (p.item.id <= 50)) this.admins.push(p);  
    if ((p.item.parentId == -2) || ((p.item.parentId == -1) && (p.item.id > 50))) this.globals.push(p);
    
    // let the page find its toplevel
    p.addRoot();
  }
};

Application.prototype.attachPageChildren = function() {
  // loop through all pages and attach their children
  for (var i in this.pages) {
    // let the page itself pick from the list
    this.pages[i].addChildren(this.pages);
  }
};

Application.prototype.fetchPages = function(connection) {
  var self = this;
  
  connection.query('select * from pages', [], function(err, result) {
    self.pages = [];
    self.urls = {};
    for (var i = 0; i < result.length; i++) {
      var O = new jcms.Page(result[i], self);
              
      O.addTo(self);
      O.getContent(connection);
    }
    self.attachPageChildren();
    self.genSpecials();
    
    self.log("Application.fetchPages", "fetched " + result.length + " pages");
        
    // next step
    self.fetchForms(connection);
  });
};

Application.prototype.dump = function() {
  var cnt = 0;
  
  function printLevel(r, nr) {
    var tab = "";
    for (var i=0; i<nr; i++) tab = tab + " ";

    for(var p in r) {
      console.log(tab + r[p].shortString());
      cnt += r[p].content[0].length;
      printLevel(r[p].children, nr+2);
    }
  }
  
  this.dumped = true;
  // console.log("Roots:");
  // printLevel(this.roots, 0);
  console.log("--- Admin ---");
  printLevel(this.admins, 1);
  console.log("--- Global ---");
  printLevel(this.globals, 1);
  console.log("----------------");
  console.log("Total content: " + cnt + " bytes");
  console.log("----------------");
};


///////////
// forms //
///////////
Application.prototype.fetchForms = function(connection) {
	var self = this;
  
	// fetch all forms
  
    // next step
    self.fetchDomains(connection);
};


///////////
// forms //
///////////
Application.prototype.fetchDomains = function(connection) {
	var self = this;
  
	// fetch all user domains and close connection when finished
    connection.query('select distinct domain from users order by 1', [], function(err, result) {
	    self.domains = [];
	    for (var i = 0; i < result.length; i++) {
	      self.domains.push(result[i].domain);
	    }
	    self.log("Application.fetchDomains", "fetched " + result.length + " domains");
	  
		// no next step
		connection.end();
	});
};



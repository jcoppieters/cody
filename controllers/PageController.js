//
// Johan Coppieters - jan 2013 - jWorks
//
//
var mysql = require('mysql');
var cody = require('../index.js');

console.log("loading " + module.id);


/* One off object for making roots for Pages and Dashboard */

function Root(controller, id, name) {
  var myRoot = controller.getObject(id);
  var myChildren = myRoot.getChildren();
  
  this.getId = function() { return id; };
  this.getName = function() { return name; };
  this.hasChildren = function() { return (myChildren.length > 0); };
  this.getChildren = function() { return myChildren; };
 }
 

/* Actual PageController */

function PageController(context) {
  console.log("PageController.constructor -> page(" + context.page.itemId + ") = " + context.page.title + ", request = " + context.request);
  
  // init inherited controller
  cody.TreeController.call(this, context);
}

PageController.prototype = Object.create( cody.TreeController.prototype );
// needed?  PageController.prototype.constructor = PageController;

module.exports = PageController;



PageController.prototype.doRequest = function( finish ) {
  var self = this;

  self.context.opennode = "0";
  self.context.shownode = "0";
  
  if (self.isRequest("realdelete")) {
    self.realDelete( self.getParam("node"), function whenDone(result) {
      if (result.status !== "OK") {
        self.feedBack(false, "Something went wrong during delete."); 
      }
      finish();
    });
    
    
  } else if (self.isRequest("savecontent")) {
    self.saveContent( self.getParam("node"), self.getParam("id"), finish);

    
  } else if (self.isRequest("addcontent")) {
    self.addContent( self.getParam("node"), self.getParam("kind"), function(newId) {
      finish( { status: "OK", id: newId } );
    });

    
  } else if (self.isRequest("deletecontent")) {
    self.deleteContent( self.getParam("node"), self.getParam("id"), function() {
      finish( { status: "OK" } );
    });

    
  } else if (self.isRequest("adjust")) {
    self.adjustContent( self.getParam("node"), function whenDone(result) {
      // get all info and data on this node
      finish( { status: "OK" } );
    });

  } else if (self.isRequest("SaveX")) {
    var nodeId = self.getParam("node");
    self.saveInfo( nodeId, function() {
      self.addContent(nodeId , self.getParam("kind"), function(newId) {
        self.context.opennode = cody.TreeController.toId(nodeId);
        self.context.shownode = cody.TreeController.toId(nodeId);
        finish();
      });
    });


  } else {
    self.context.shownode = cody.TreeController.toId(this.getParam("shownode", ""));
    self.context.opennode = cody.TreeController.toId(this.getParam("opennode", ""));

    // super.doRequest
    cody.TreeController.prototype.doRequest.call(self, finish);
    
  }
};



/* Overridden - Config functions */

PageController.prototype.getRoot = function() {
  return cody.Application.kHomePage;
};

PageController.prototype.getType = function(theNode) {
  return (theNode.item.showcontent === cody.Item.kContent) ? "html" : "";
};
PageController.prototype.getFolder = function() {
  return "";
};
PageController.prototype.getObject = function(id) {
  var language = this.context.page.language;  
  return this.app.getPage(language, id);
};



/* PageController utilities */

PageController.prototype.respace = function( parent, finish ) {
  var self = this;

  // Find all children, any page of the item will do, they all have the same children in any language
  var aPage = this.getObject(parent.id);

  var nr = 0;
  cody.Application.each(aPage.children, function respaceOnePage(done) {
    var aChildPage = this;
    nr += 10;
    // console.log("PageController.Respace: checking '" + aChildPage.item.name + "' now = " + aChildPage.item.sortorder + " to " + nr);
    if (aChildPage.item.sortorder !== nr) {
      aChildPage.item.sortorder = nr;
      aChildPage.item.doUpdate(self, function() {
        done();
      });
    } else {
      done();
    }

  }, function whenDone(err) {
    if (err) { console.log("PageController - respace: error = " + err); }
    if (typeof finish === "function") { finish(); }

  });

};


/* Overridden - Action functions */

PageController.prototype.addObject = function( title, refNode, type, kind, finish ) {
  var self = this;
  var show = this.getParam("showcontent", "Y");
  console.log("Received PageController - addObject, refnode = " + refNode + ", type = " + type + ", kind = " + kind+ ", show = " + show);

  var refNodeId = cody.TreeController.toId(refNode);
  var orderNr, aParent;

  // fetch the user id
  var userId = this.getLoginId();

  // fetch the parent and sortorder
  if (type === "inside") {
    orderNr = 5;
    aParent = self.app.getItem(refNodeId);
  } else {
    // after -> is always at the end -> we never get this !! (worked with previous version of jsTree)
    var refItem = self.app.getItem(refNodeId);
    orderNr = refItem.sortorder + 10;
    aParent = refItem.parent;
  }

  // can we make modifications to this parent node
  if (! self.isAllowed(aParent)) {
    finish( { status: "NAL" } );
    return;
  }

  // make the item
  var basis = cody.Item.addDefaults({name: title, user: userId, sortorder: orderNr, template: kind, showcontent: show}, aParent);
  var anItem = new cody.Item(basis, self.app);

  try {
    anItem.doUpdate(self, function() {
      // we need the id of the new item, so use the callback
      self.app.addItem(anItem);

      // make the page in all languages
      var langs = self.app.getLanguages();

      cody.Application.each( langs, function makePageForLanguage(done) {
        // iterator over all languages
        basis = cody.Page.addDefaults({language: this.id}, anItem);
        var aPage = new cody.Page(basis, self.app);

        aPage.doUpdate(self, function() {
            self.app.addPage(aPage);
            aPage.adjustContent(self, done);
        }, true);

      }, function whenDone(err) {
        // terminator

        if (err) {
          finish( { status: "NOK", error: err } );

        } else {
          finish( { status: "OK", node: "id_" + anItem.id } );
        }
      });
    });

  } catch (e) {
    console.log("PageController.AddPage: Failed to create the Item or Page objects.");
    console.log(e);
    finish( { status: "NOK", error: e } );
  }
};


PageController.prototype.moveObject = function( nodeId, refNode, type, finish ) {
  var self = this;
  // type = "before" / "after" or "last" / "inside"
  console.log("Received PageController - moveObject, refnode = " + refNode +
              ", node = " + nodeId + ", type = " + type);
  
  var orderNr;
  var aParent;
  
  // fetch the parent and insertion point
  if ((type === "inside") || (type === "last")) {
    aParent = self.app.getItem(cody.TreeController.toId(refNode));
    orderNr = 9999;
  } else {  
    var refItem = self.app.getItem(cody.TreeController.toId(refNode));
    aParent = self.app.getItem(refItem.parentId);
    orderNr = refItem.sortorder + ((type === "before") ? -5 : +5);
  }
  
  // fetch the node to be moved
  var anItem = self.app.getItem(cody.TreeController.toId(nodeId));
  var curParent = self.app.getItem(anItem.parentId);
  
  // check the new target parent
  if (! self.isAllowed(aParent)) {
    finish( { status: "NAL" } );
    return;
  }
  
  // check the current parent
  if (! self.isAllowed(curParent)) {
    finish( { status: "NAL" } );
    return;
  }

  // position in the tree
  anItem.parentId = aParent.id;
  // console.log("PageController.MovePage: old order = " + anItem.sortorder + " (of " + anItem.id + "), new order = " + orderNr);
  anItem.sortorder = orderNr;
  
  try {
    // anItem.doUpdate(self); -> done in respace too, so no need to call it here
    self.app.buildSitemap();

    self.respace(aParent, function whenDone() {
      finish( { status: "OK" } );
    });
    
  } catch (e) {
    console.log("PageController.MovePage: Failed to update the Item object.");
    console.log(e);
    finish( { status: "NOK", error: e.toString() } );
  }
};


PageController.prototype.renameObject = function( title, nodeId, finish ) {
  var self = this;
  console.log("Received PageController - renameObject, node = " + nodeId + ", title = " + title);
      
  var aPage = self.getObject( cody.TreeController.toId(nodeId) );
  if (aPage) {
      
    if (! self.isAllowed(aPage)) {
      finish( { status: "NAL" } );
      return;
    }

    aPage.title = title;
  
    try {
      aPage.doUpdate(self, function() {

        // change all names for pages from this item that still have the defaultName
        //   (the item was probably just created)
        var langs = self.app.getLanguages();
        cody.Application.each( langs, function forEachLanguage(next) {
          anotherPage = self.app.getPage(this.id, aPage.itemId);
          if (anotherPage.title === cody.Item.kDefaultName) {
            anotherPage.title = title;
            anotherPage.doUpdate(self, next);
          } else {
            next();
          }

        }, function whenDone(err) {
          // perhaps overkill but for (sortorder == alphabetical) the order of pages can change
          self.app.buildSitemap();

          // rename the item if it iss the page of the default language (although item names are not shown)
          // it's nice for debugging the database
          if ((self.app.isDefaultLanguage(aPage.language)) || (aPage.item.name === cody.Item.kDefaultName)) {
            aPage.item.name = title;
            aPage.item.doUpdate(self, function() {
              finish( { status: "OK" } );
            });
          } else {
            finish( { status: "OK" } );
          }
        });
      });
      
      
    } catch (e) {
      console.log("PageController.RenameObject: Failed to update the Page or Item object.");
      finish( {status: "NOK", error: e } );
    }
    
  } else {
    finish( {status: "NOK", error: "page not found" } );
  }
};


PageController.prototype.realDelete = function( node, finish ) {
  var self = this;
  
  console.log("Received PageController - realdelete, node = " + node);
  
  //request to delete a node from the tree
  var aPage = self.getObject( cody.TreeController.toId(node) );
  var anItem = aPage.item;
  
  // if possible, show this node after the delete
  self.context.shownode = anItem.parentId;


  if (! self.isAllowed(anItem)) {
    finish( { status: "NAL" } );
    return;
  }
  
  if (aPage.hasChildren()) {
    finish( { status: "NOE" } );
    return;
  }
  
  try {
    anItem.doDelete(self, function() {
      finish( { status: "OK" } );
    });
    
  } catch(e) {
    console.log("PageController.RealDelete: Failed to delete the Page object -- " + e);
    finish( { status: "NOK", error: e } );
  }
};


PageController.prototype.deleteObject = function( nodeId, finish ) {
  var self = this;
  
  // for pages, this function only de-activates the item
  console.log("Received PageController - deleteObject, node = " + nodeId);
  
  try {
    var aPage = self.getObject( cody.TreeController.toId(nodeId) );
    
    if (! self.isAllowed(aPage)) {
      finish( { status: "NAL" } );
      return;
    }

    aPage.doDeactivate(self, function() {
      finish( { status: "OK" } );
    });

    
  } catch (e) {
    console.log("PageController.DeletePage: Failed to delete the Page object -- " + e);
    finish( { status: "NOK", error: e } );
  }
};


PageController.prototype.fetchNode = function( theNode, finish ) {
  var self = this;
  
  var aPage = self.getObject( cody.TreeController.toId(theNode) );
  if (! self.isAllowed(aPage)) {
    this.gen("NAL,User is not allowed to edit this page with id = " + theNode, { "Content-Type": "application/html" });
    return;
  }
  
  // just switch the page in our current context and we're done ??
  self.context.page = aPage;
  
  //TODO: get all the (main) content blocks connected to this page
  // for the moment they are all there from startup
  // but then -> question? how do I get rid of all the (main) blocks -- and keep the (intro) blocks
  //  actually: "when" do I do this?
  
  console.log("PageController.FetchNode: node = " + theNode + " + language = " + aPage.language + " => " + self.context.page.item.id);
  finish();
};


PageController.prototype.saveInfo = function( nodeId, finish ) {
	var self = this;
	
  var aPage = self.getObject( cody.TreeController.toId(nodeId) );
  var anItem = aPage.item;

  anItem.scrapeFrom(self);
  anItem.doUpdate(self, function() {

    aPage.scrapeFrom(self);
    aPage.doUpdate(self, function() {

      aPage.updateContent(self, function() {

        // sortBy attributes can be changed
        self.app.buildSitemap();
        
        // signal node to be selected in the tree view
        self.context.shownode = anItem.id;
        
        finish();
      });
    });
  });
 };



/* Controller specific, called from template */

PageController.prototype.getDashboardTree = function() {
  return this.getTree( new Root(this, cody.Application.kDashboardPage, "Dashboard") );
};

PageController.prototype.getOrphansTree = function() {
  return this.getTree( new Root(this, cody.Application.kOrphansPage, "Pages") );
};


/* content stuff */

PageController.prototype.saveContent = function(thePage, theId, finish) {
  var self = this;

  var aPage = self.getObject( cody.TreeController.toId(thePage) );
  var aContentId = cody.TreeController.toId(theId);

  console.log("Received PageController - saveContent, pageId = " + thePage + ", contentId = " + aContentId);
  try {

    if (! self.isAllowed(aPage)) {
      finish( { status: "NAL" } );
      return;
    }

    var aContent;
    if (aContentId !== 0) {
      aContent = aPage.getContent(aContentId);
    } else {
      aContent = new cody.Content({}, self.app);
      aContent.attachTo(aPage, aPage.item.id, aPage.language);
    }
    aContent.scrapeFrom(self);

    aContent.doUpdate(self, (aContentId === 0), function(err) {
      if (err) {
        finish( { status: "NOK", error: err } );
      } else {
        finish( { status: "OK" } );
      }
    });


  } catch (e) {
    console.log(e);
    console.log("PageController.SaveData: failed to save the content of page " + thePage + " with id = " + theId);

    finish( { status: "NOK", error: e } );
  }
};


PageController.prototype.adjustContent = function( theNode, finish ) {
  var self = this;
  console.log("PageController.adjustContent: add correct Content for " + theNode + "");

  var aPage = self.getObject( cody.TreeController.toId(theNode) );
  aPage.adjustContent( self, function() {
    self.context.fetchnode = "id_" + aPage.itemId;
    finish();
  });
};


PageController.prototype.addContent = function( theNode, theKind, finish ) {
  var self = this;
  console.log("PageController.addContent: " + theKind + ", for " + theNode + "");
  
  var aPage = self.getObject( cody.TreeController.toId(theNode) );
  aPage.addContent( self, theKind, function(newId) {
    finish(newId);
  });
};


PageController.prototype.deleteContent = function( theNode, theId, finish ) {
  var self = this;
  console.log("PageController.deleteContent: delete content " + theId + ", for " + theNode + "");
  
  var aPage = self.getObject( cody.TreeController.toId(theNode) );
  aPage.deleteContentById(self, cody.TreeController.toId(theId), function() {
    finish();
  });
};


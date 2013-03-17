//
// Johan Coppieters - jan 2013 - jWorks
//
//
var mysql = require('mysql');
var jcms = require('./index.js');

console.log("loading " + module.id);

module.exports = SitemapController;

function SitemapController(context) {
  console.log("SitemapController.constructor -> page: (" + context.page.itemId + ") " + context.page.title);
  
  // init inherited controller
  jcms.TreeController.call(this, context);
}

SitemapController.prototype = new jcms.TreeController();


SitemapController.prototype.doRequest = function( finish ) {
  var self = this;
  
  self.context.fn = "admin/sitemap.ejs";
  
  if (self.context.request == "realdelete") {
    self.realDelete( this.getParam("node"), function(result) {
      if (result.status != "OK") { 
        this.feedback(false, "Something went wrong during delete."); 
      }
      finish();
    });
    
  } else if (self.context.request == "adjust") {
    self.adjustElements( self.getParam("node"), function(result) {
      // get all info and data on this node
      self.context.request = "getnode";
      jcms.TreeController.prototype.doRequest.call(this, finish);
    });

  } else {
    // this.super.doRequest( finish );  of  this.super.doRequest.call(this, finish);
    jcms.TreeController.prototype.doRequest.call(this, finish);
    
  }
};

/* Overridden - Config functions */
function Root(aList, id, name) {
  this.getId = function() { return id; };
  this.getName = function() { return name; };
  this.hasChildren = function() { return true; };
  this.getChildren = function() { return aList; };
 }
 
SitemapController.prototype.getRoot = function() {
  return this.app.roots[this.context.page.language];
};

SitemapController.prototype.getType = function(theNode) { 
  return ""; 
};

SitemapController.prototype.getFilePath = function() { 
  return ""; 
};
SitemapController.prototype.getObject = function(id) {
  var language = this.context.page.language;  
  return this.app.getPage(language, id);
};


/* Overridden - Action functions */

SitemapController.prototype.addObject = function( title, refNode, type, kind, finish ) {
    var self = this;
    console.log("Received SitemapController - insert, refnode = " + refNode + ", type = " + type);
    
    var refNodeId = self.toId(refNode);
    var orderNr, aParent;

    // fetch the user id
    var userId = this.getLoginId();
    
    // fetch the parent and sortorder
    if (type == "inside") {
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
    var basis = jcms.Item.addDefaults({name: title, user: userId, sortorder: orderNr}, aParent);
    var anItem = new jcms.Item(basis, self.app);
    
    try {
      anItem.doUpdate(self, function() {
        // we need the id of the new item, so use the callback
        self.app.addItem(anItem);
          
        // make the page in all languages
        var langs = self.app.getLanguages();
        for (var a in langs) {
          basis = jcms.Page.addDefaults({language: langs[a].id}, anItem);
          var aPage = new jcms.Page(basis, self.app);
            
          //TODO: daisy chain the addPage calls, with a continuation
          aPage.doUpdate(self, function() {
              self.app.addPage(aPage);
          }, true);
            
          //TODO: add default elements from template and insert in the database
          //aContent.FetchElements(aPage.fLanguage, - aDefaultTemplateId);
          //aContent.doInsertElements();
          
          
          finish( { status: "OK", node: "id_" + anItem.id } );
        }
      });
        
    } catch (e) {
      console.log("SiteMapController.AddPage: Failed to create the Item or Page objects.");
      console.log(e);
      finish( { status: "NOK", error: e } );
    }
};


SitemapController.prototype.moveObject = function( nodeId, refNode, type, finish ) {
  // type = "before", "after" or "inside"
  console.log("Received SitemapController - move, refnode = " + refNode + 
              ", node = " + nodeId + ", type = " + type);
  
  var orderNr;
  var aParent;
  
  // fetch the parent and insertion point
  if (type == "inside") {
    aParent = this.app.getItem(this.toId(refNode));
    orderNr = 9999;
  } else {  
    var refItem = this.app.getItem(this.toId(refNode));
    aParent = this.app.getItem(refItem.parentId);
    orderNr = refItem.sortorder + ((type == "before") ? -5 : +5);
  }
  
  // fetch the node to be moved
  var anItem = this.app.getItem(this.toId(nodeId));
  var curParent = this.app.getItem(anItem.parentId);
  
  // check the new target parent
  if (! this.isAllowed(aParent)) {
    finish( { status: "NAL" } );
    return;
  }
  
  // check the current parent
  if (! this.isAllowed(curParent)) {
    finish( { status: "NAL" } );
    return;
  }
  
    
  // position in the tree
  anItem.parentId = aParent.id;
  console.log("SiteMapController.MovePage: old order = " + anItem.sortorder + ", new order = " + orderNr);
  anItem.sortorder = orderNr;
  
  try {
    // anItem.doUpdate(this); -> done in respace too, so no need to call it here
    this.app.buildSitemap();
    
    this.respace(aParent, function() {
      finish( { status: "OK" } );
    });
    
  } catch (e) {
    console.log("SiteMapController.MovePage: Failed to update the Item object.");
    console.log(e);
    finish( { status: "NOK", error: e.toString() } );
  }
};


SitemapController.prototype.renameObject = function( title, nodeId, finish ) {
  var self = this;
  console.log("Received SitemapController - rename, node = " + nodeId + ", title = " + title);
      
  var aPage = self.getObject( self.toId(nodeId) );
  if (aPage) {
      
    if (! self.isAllowed(aPage.item)) {
      finish( { status: "NAL" } );
      return;
    }

    aPage.title = title;
  
    try {
      aPage.doUpdate(self, function() {
        
       // perhaps overkill but for sortorder == alphabetical the order of pages can change
       self.app.buildSitemap();
       
       // rename the item if it's the page of the default language (although item names are not shown)
       if ((self.app.isDefaultLanguage(aPage.language)) || (aPage.item.name == jcms.Item.kDefaultName)) {
          aPage.item.name = title;
          aPage.item.doUpdate(self, function() {
            finish( { status: "OK" } );
          });
        } else {
          finish( { status: "OK" } );
        }
      });
      
      
    } catch (e) {
      console.log("SiteMapController.RenameObject: Failed to update the Page or Item object.");      
      finish( {status: "NOK", error: e } );
    }
    
  } else {
    finish( {status: "NOK", error: "page not found" } );
  }
};


SitemapController.prototype.realDelete = function( node, finish ) {
  var self = this;
  
  console.log("Received SitemapController - realdelete, node = " + node);
  
  //request to delete a node from the tree
  var aPage = self.getObject( self.toId(node) );
  var anItem = aPage.item;
  
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
    console.log("SiteMapController.RealDelete: Failed to delete the Page object -- " + e);  
    finish( { status: "NOK", error: e } );
  }
};


SitemapController.prototype.deleteObject = function( nodeId, finish ) {
  var self = this;
  
  // for pages, this function only de-activates the item
  console.log("Received SitemapController - delete, node = " + nodeId);
  
  try {
    var aPage = self.getObject( self.toId(nodeId) );
    
    if (! self.isAllowed(aPage.item)) {
      finish( { status: "NAL" } );
      return;
    }

    aPage.doDeactivate(self, function() {
      finish( { status: "OK" } );
    });

    
  } catch (e) {
    console.log("SiteMapController.DeletePage: Failed to delete the Page object -- " + e);  
    finish( { status: "NOK", error: e } );
  }
};


SitemapController.prototype.makeSelect = function( type ) {
};


SitemapController.prototype.uploadFile = function( filePath, nodeId ) {
};


SitemapController.prototype.fetchNode = function( theNode ) {
  var self = this;
  
  var aPage = self.getObject( self.toId(theNode) );
  if (! self.isAllowed(aPage.item)) { return {status: "NAL"}; }
  
  // just switch the page in our current context and we're done ??
  self.context.page = aPage;
  
  //TODO: get all elements connected to this page
  self.context.editElements = [];
  
  console.log("SitemapController.FetchNode: node = " + theNode + " + language = " + aPage.language + " => " + self.context.page.item.id);

};

SitemapController.prototype.updateElements = function( nodeId, finish ) {
	finish();
};

SitemapController.prototype.saveInfo = function( nodeId, finish ) {
	var self = this;
	
  var aPage = self.getObject( self.toId(nodeId) );
  var anItem = aPage.item;

  anItem.scrapeFrom(self);
  anItem.doUpdate(self, function() {

    aPage.scrapeFrom(self);
    aPage.doUpdate(self, function() {

      self.updateElements(aPage, function() {

        self.app.buildSitemap();
        finish();
      });
    });
  });
 };


SitemapController.prototype.toId = function( nodeId ) {
  return (! nodeId) ? 0 : ((nodeId.indexOf("_") > 0) ? nodeId.substring(3) : nodeId);
};


/* Controller specific, called from template */

SitemapController.prototype.getAdminTree = function() {
  return this.renderTree( new Root(this.app.admins, 1, "Admin"), false, 99 );
};

SitemapController.prototype.getGlobalTree = function() {
  return this.renderTree( new Root(this.app.globals, 1, "Globals"), false, 99 );
};


SitemapController.prototype.adjustElements = function( theNode ) {
};


/* SitemapController utilities */
SitemapController.prototype.respace = function( parent, finish ) {
	var self = this;
	
  // Find all children, any page of the item will do, they all have the same children in any language
  var aPage = this.getObject(parent.id);

  var nr = 0;
  for (var x in aPage.children) { var cp = aPage.children[x];
    nr += 10;
    console.log("SiteMapController.Respace: checking '" + cp.item.name + "' now = " + cp.item.sortorder + " to " + nr);
    if (cp.item.sortorder != nr) {
      cp.item.sortorder = nr;
      cp.item.doUpdate(self, function() {});
      // either trust in the Force or daisy chain them
      //TODO: daisy chain the addPage calls, with a continuation
    }
  }
  if (typeof finish == "function") { finish.call(self); }
};


SitemapController.prototype.isAllowed = function( theNode ) {
  var aUserDomain = this.getLogin().getDomain();
  var anItemDomain = theNode.getAllowedGroups();
  
  console.log("TSiteMapController.isAllowed: user = '" + aUserDomain + "', item = '" + anItemDomain + "'");

  if (aUserDomain.length == 0) { return false; }
  if ((aUserDomain=="*") || (aUserDomain=="rWorks")) { return true; }
    
  if ((anItemDomain.equals=="*") || (anItemDomain.length == 0)) { return true; }
  
  var aList = anItemDomain.split(",");
  for (var x in aList) {
    if (aList[x]==aUserDomain) { return true; }
  }
  
  return false;
};


/*
  void updateElements(TPage thePage) {
    // update all elements attached to this page (TElements -> db:elements)
    // no need to update the ArrayList of elements attached to the TContent, as it gets destroyed any second now...
    String aCList = this.getParam("elements");
    String aList[] = aCList.split(",");
    int nr = 1;
    for (String anId: aList) {
      try {
        int anItemNr = Integer.parseInt(anId);
        String aType = this.getParam("K"+anId);
        
        if (aType.equals("X")) 
          TElement.doDelete(this.fRequest, anItemNr);
        else if (anItemNr > 900)
          TElement.doInsert(this.fRequest, thePage.fItemId, this.getParam("N"+anId), 
                    aType, this.getParam("S"+anId), nr*10);
        else
          TElement.doUpdateLoad(this.fRequest, anItemNr, this.getParam("N"+anId), 
                      aType, this.getParam("S"+anId), nr*10);
      } catch (Exception e) {}
      nr++;
    }
  }
  
   
   
  String SaveData(String thePageId, String theData) {    
    try {
      int theId = Integer.parseInt(thePageId.substring(3));
      TPage aPage = this.fApplication.GetPage(this.fRequest.getLanguage(), theId);
      
      if (! this.isAllowed(aPage.item)) return "NAL";
      
      // update the large chunk of data from this page (TContent.fData -> db:content)
      TContent.doSaveData(this.fRequest, theId, theData);
      return "OK";
    } catch (Exception e) {
      console.log("TSiteMapController.SaveData: failed to save (" + thePageId + ")");
      e.printStackTrace();

      return "NOK";
    }
  }

  
  void AdjustElements(String theNode) {
    try {
      String aLan = this.fRequest.getLanguage();
      TPage aPage = this.fApplication.GetPage(aLan, Integer.parseInt(theNode));
      this.UpdatePage(aPage);

      this.UpdateItem(aPage);

      TContent aContent = new TContent(this.fRequest, aPage);
      
      
      // delete old elements from database, we didn't "init" the TContent so nothing is attached
      TElement.doDelete(this.fRequest, aPage.fLanguage, aPage.fItemId, false);
      
      // copy from template
      aContent.FetchElements(aPage.fLanguage, - aPage.fItem.fTemplateId);
      
      // insert into the database
      aContent.doInsertElements();
      
      this.fRequest.setVar(TApplication.kRequest, "savedPage", aPage);
      this.fRequest.setStr(TApplication.kRequest, "fetchnode", "id_" + theNode);

      console.log("TSiteMapController.AdjustElements: add correct Elements for (" + theNode + ")");
    
    } catch (Exception e) {
      console.log("TSiteMapController.AdjustElements: failed add correct Elements for (" + theNode + ")");
      e.printStackTrace();
    }
  }
   

*/
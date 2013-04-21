  
//
// Johan Coppieters - mar 2013 - jCMS
//
//
console.log("loading " + module.id);

var mysql = require("mysql");
var jcms = require('./index.js');


function TreeController(context) {
  // only called for using my methods
  if (context === undefined) { return; }

  console.log("TreeController.constructor -> page(" + context.page.itemId + ") = " + context.page.title + ", request = " + context.request);

  // init inherited controller
  jcms.Controller.call(this, context);
}
module.exports = TreeController;

TreeController.prototype = new jcms.Controller();


// Next 4 should be overridden
TreeController.prototype.getRoot = function() { 
  return null; 
};

TreeController.prototype.getType = function(theNode) { 
  return ""; 
};

TreeController.prototype.getFilePath = function() { 
  return ""; 
};
TreeController.prototype.getObject = function(id) {
  return null;
};


/* required protocol for nodes:
Node.prototype.getAllowedGroups = function() { return ""; }
Node.prototype.hasChildren = function() { return false; }
Node.prototype.isActive = function() { return true; }
Node.prototype.isVisible = function() { return true; }
Node.prototype.getChildren = function() { return []; }
Node.prototype.getSortOrder = function() {}
Node.prototype.setSortOrder = function(nr) {}
Node.prototype.setName = function(name) {}
Node.prototype.getName = function() {}
Node.prototype.getId = function() {}

Node.prototype.doUpdate = function(controller, finish) {}
Node.prototype.doDelete = function(controller, finish) {}
*/
      

TreeController.prototype.toId = function(theNode) {
  return parseInt(theNode.substring(3));
};

TreeController.prototype.doRequest = function( finish ) {
  var self = this;

  if (self.context.request == "insert") {
    // a new node was inserted in the tree
  	self.addObject( self.getParam("title"), 
                    self.getParam("refnode"), 
                    self.getParam("type"), 
                    self.getParam("kind"), finish );
    
  } else if (self.context.request == "move") {
    // a  node was being moved around in the tree
    this.moveObject( self.getParam("node"), 
                     self.getParam("refnode"),
                     self.getParam("type"), finish);
    
  } else if (self.context.request == "rename") {
    // a node has been renamed in the tree
    this.renameObject( self.getParam("title"),  
                       self.getParam("node"), finish);
          
  } else if (self.context.request == "delete") {
    // request to delete a node from the tree
    this.deleteObject( self.getParam("node"), finish);
    
  } else if (self.context.request == "select") {
    // generate a input/type=select
    this.gen( this.getList() );
    finish("");
    
  } else if (self.context.request == "fileupload") {
    this.gen( this.uploadFile( this.getFilePath(), self.getParam("node") ));
    finish("");
          
  } else if (self.context.request == "getnode") {
    // get all info and data on this node
    this.fetchNode( self.getParam("node") );
    finish( self.context.fn.replace(".ejs", "-ajax.ejs") );
              
  } else if (self.context.request == "save") {
    // save all info on this node (done by a submit, so we need to redraw the screen, too bad)
    this.saveInfo( self.getParam("node"), finish );
        
  } else {
    // no specific request, just draw the tree...
    finish();
  }
};

// display the complete tree to be used in a select/menu.
TreeController.prototype.renderList = function( theNode ) {
  var self = this;
  
  var aTree = "";
  var aList = theNode.getChildren();
  for (var x in aList) { var p = aList[x];
   if (p.isVisible()) {
     if (p.hasChildren()) {
         // this is a "folder"
       var subLevel = self.renderList(p);
       // make fake subfolder if empty
         if (subLevel.length == 0)
           aTree += "<li><a href=\"#\" id=\"" + p.getId() + "\">" + p.getName() + "<ul><li><a></a></li></ul></a></li>";
         else
           aTree += "<li><a href=\"#\" id=\"" + p.getId() + "\">" + p.getName() + "</a>" + subLevel + "</li>";
     } else
       // this is an object
       aTree += "<li><a href=\"#\" kind=\"" + self.getType(p) + "\" id=\"" + p.getId() + "\">" + p.getName() + "</a></li>";
    }
   }
   if (aTree.length == 0)
     return "";
   else
     return "<ul>" + aTree + "</ul>";
};
  
    
TreeController.prototype.getList = function() {
  return this.renderList( this.getRoot() );
};


// The complete tree for the admin part of the site
TreeController.prototype.renderTree = function( theNode, open, descend ) {
  var self = this;
  
  var aTree = "";
  var aList = theNode.getChildren(); 
  console.log("getChildren of " + theNode.name + "/" + theNode.id + " : " + aList.length); // console.log(aList);
  for (var x in aList) { var p = aList[x];
     var name = (p.isActive()) ? p.getName() : "("+p.getName()+")";
     var classes = (open ? "open " : "") +
     		           (p.isVisible() ? "" : "invisible ") + 
     		           (p.isActive() ? "" : "deleted");
       aTree += "<li id=\"id_" + p.getId() + "\" class=\"" + classes + "\"" +
             (p.hasChildren() ? "" : " rel=\""+ this.getType(p) + "\"") +
            "><a href=\"#\">" + name + "</a>";
       if (descend > 0)
         aTree += self.renderTree(p, false, descend-1);
       aTree += "</li>";
  }
  if (aTree.length == 0)
     return "";
  else
     return "<ul>" + aTree + "</ul>";
};
  
TreeController.prototype.getTree = function() {
  return this.renderTree( this.getRoot(), false, 99 );
};


TreeController.prototype.saveInfo = function( nodeId, finish ) {
  var anObject = this.getObject(this.toId(nodeId));
  if (anObject) {
      anObject.scrape(this);
      anObject.doUpdate(this);
      finish( { status: "OK" });
  } else {
    finish({status: "NOK"});
  }
};


TreeController.prototype.addObject = function( title, refNode, type, kind, finish ) {
  finish( { status: "NOK" } );
};

TreeController.prototype.moveObject = function( nodeId, refNode, type, finish ) {
  finish( { status: "NOK" } );
};

TreeController.prototype.renameObject = function( title, nodeId, finish ) {
  console.log("Received TreeController - rename, node = " + nodeId + ", title = " + title);
  
  var anObject = this.getObject(this.toId(nodeId));
  if (anObject) {
    try {
      anObject.setName(title);
      anObject.doUpdate(this);
      // pass next line into doUpdate to wait for the result or just trust in the Force
      finish( { status: "OK" } );
      
    } catch (e) {
      console.log("TreeController.RenameObject: Failed to update the object - " + e);      
      finish( { status: "NOK", error: e } );
    }
  } else {
    finish( { status: "NOK"} );
  }
};
TreeController.prototype.deleteObject = function( nodeId, finish ) {
  var anObject = this.getObject(this.toId(nodeId));
  if (this.app.hasAtomChildren(anObject)) {
    finish( { status: "Not empty" } );
    
  } else {
    anObject.doDelete(this);
    //TODO: delete file !!!
    finish( { status: "OK"} );    
  }
};


TreeController.prototype.makeSelect = function( type ) {
};
TreeController.prototype.uploadFile = function( filePath, nodeId ) {
};

TreeController.prototype.fetchNode = function( nodeId ) {
  console.log("TreeController.FetchNode: nodeId = " + nodeId);
  this.context.atom = this.getObject(this.toId(nodeId));
};

TreeController.prototype.respace = function(theParent) {
  var self = this;
  var nr = 0;
    var aList = theParent.getChildren();

  for  (var i in aList) { var node = aList[i];
    nr += 10;
    if (node.getSortOrder() != nr) {
      node.setSortOrder(nr);
      node.update(self.context);
    }
  }
};

  
  
/*  
  String DeleteObject( String theNode ) {
    TApplication.printLog("Received TTreeController - delete, node = " + theNode);
    
    try {
      int anItemId = toId(theNode);
      if (this.fApplication.hasParentObject(anItemId))
        return "NOK: this object still contains content";
      else {
        TObject anObject = this.fApplication.GetObject(anItemId);
        anObject.doDelete(this.fRequest);
        try {
              String fn = TDataServer.MakeOSPath(this.fRequest.getHost() + this.getFilePath(), anItemId + "." + anObject.fExtention);
          TApplication.printLog("TTreeController.DeleteObject: Deleting file = " + fn);  
          File f = new File(fn);
          if (! f.delete())
            throw new IllegalArgumentException("File deletion failed");
          return "OK";
        } catch (Exception e) {
          TApplication.printLog("TTreeController.DeleteObject: Failed to delete the file.");
          return "NOK: could not delete the file";
        }
      }
      
    } catch (Exception e) {
      TApplication.printLog("TTreeController.DeleteObject: Failed to delete the object.");  
      return "NOK";
    }
  }
  
  
  
  
  String AddObject( String theTitle, String theRefNode, String theType, String theKind ) {
    TApplication.printLog("Received TTreeController - insert, refnode = " +theRefNode+ 
                ", title = " + theTitle + ", type = " + theType + ", kind = " + theKind);
    int orderNr;
    TObject aParent;

    // fetch the parent
    if (theType.equalsIgnoreCase("inside")) {
      // is only possible if parent is empty
      orderNr = 10;
      aParent = this.fApplication.GetObject(toId(theRefNode));
    } else { 
      // after -> is always at the end
      TObject anObject = this.fApplication.GetObject(toId(theRefNode));
      orderNr = anObject.fSortOrder + 10;
      aParent = this.fApplication.GetObject(anObject.fParentId);
    }
        
    // make the item
    TObject anObject = new TObject(theTitle, aParent.fId, orderNr, 
                    ((theKind.charAt(0) == 'I') ? "xxx" : ""), 
                    this.fRequest.fApplication);
    
    try {
      anObject.doInsert(this.fRequest);
      this.fApplication.AddObject(anObject);
    
    } catch (Exception e) {
      TApplication.printLog("TTreeController.AddObject: Failed to create a new object.");
      e.printStackTrace();
    }
    return "id_" + anObject.fId;
  }
  
}
  */

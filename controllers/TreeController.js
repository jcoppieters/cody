  
//
// Johan Coppieters - mar 2013 - cody
//
//
console.log("loading " + module.id);

var mysql = require("mysql");
var fs = require("fs");
var cody = require('../index.js');


function TreeController(context) {
  console.log("TreeController.constructor -> page(" + context.page.itemId + ") = " + context.page.title + ", request = " + context.request);
  
  // init inherited controller
  cody.Controller.call(this, context);

  context.shownode = this.getRoot();
}

TreeController.prototype = Object.create( cody.Controller.prototype );
module.exports = TreeController;


TreeController.prototype.getFilePath = function() { 
  return this.context.dynamic + this.getFolder(); 
};

// Next 4 should be overridden
TreeController.prototype.getRoot = function() { 
  throw new Error("TreeController.getRoot should be overridden - return an id");
};
TreeController.prototype.getType = function(theNode) { 
  throw new Error("TreeController.getType should be overridden - return a string (image, folder, ...) to be used by the Atom tree to display the nodes");
};
TreeController.prototype.getObject = function(id) {
  throw new Error("TreeController.getObject should be overridden - return an Atom with the specified id");
};
TreeController.prototype.getFolder = function() { 
  throw new Error("TreeController.getFolder should be overridden - return a string / subpath in which the documents can be found");
};


/* required protocol for nodes:
Node.prototype.getAllowedDomains = function() { return ""; }
Node.prototype.hasChildren = function() { return false; }
Node.prototype.isActive = function() { return true; }
Node.prototype.isVisible = function() { return true; }
Node.prototype.getChildren = function() { return []; }
Node.prototype.getSortOrder = function() {}
Node.prototype.setSortOrder = function(nr) {}
Node.prototype.setName = function(name) {}
Node.prototype.getName = function() {}
Node.prototype.getId = function() {}

Node.prototype.scrapeFrom = function(controller) {}
Node.prototype.doUpdate = function(controller, finish) {}
Node.prototype.doDelete = function(controller, finish) {}
*/
      

TreeController.toId = function(theNode) {
  if ((typeof theNode === "undefined") || (theNode === "")) {
    return 0;
  } else if (theNode.indexOf("id_") === 0) {
    return parseInt(theNode.substring(3), 10);
  } else {
    return parseInt(theNode, 10);
  }
};


TreeController.prototype.doRequest = function( finish ) {
  var self = this;

  if (self.isRequest("insert")) {
    // a new node was inserted in the tree
    self.addObject( self.getParam("name"), 
                    self.getParam("refnode"),
                    self.getParam("type"),
                    self.getParam("kind"), finish );
    
    
  } else if (self.isRequest("move")) {
    // a  node was being moved around in the tree
    this.moveObject( self.getParam("node"), 
                     self.getParam("refnode"),
                     self.getParam("type"), finish);
    
    
  } else if (self.isRequest("rename")) {
    // a node has been renamed in the tree
    this.renameObject( self.getParam("name"),  
                       self.getParam("node"), finish);
        
    
  } else if (self.isRequest("realdelete")) {
    // request to really delete a node from the tree
    this.realDeleteObject( self.getParam("node"), finish);

    
  } else if (self.isRequest("delete")) {
    // request to mark a node as "deleted" / "inactive" in the tree
    this.deleteObject( self.getParam("node"), finish);

    
  } else if (self.isRequest("select")) {
    // generate a input/type=select
    this.gen( this.getList() );
    finish("");
       
  } else if (self.isRequest("menu")) {
    // generate a ul/li tree for menus
    this.gen( this.getMenu(), { "Content-Type": "application/html" } );
    finish("");
       
    
  } else if (self.isRequest("getnode")) {
    // get all info and data on this node
    this.fetchNode( self.getParam("node"), function() {
      finish( self.context.fn.replace(".ejs", "-ajax.ejs") );
    });
        
    
  } else if (self.isRequest("save")) {
    // save all info on this node (done by a submit, so we need to redraw the screen, too bad)
    this.saveInfo( self.getParam("node"), finish );

    
  } else {
    // no specific request, just draw the tree...
    finish();
  }
};


//display the complete tree to be used in a array with id / filename.
TreeController.prototype.getArray = function( theRoot ) {
  var self = this;
  var imagePath = self.getFilePath();
  var aRoot = self.getObject((typeof theRoot === "undefined") ? this.getRoot() : theRoot);

  function dashes(cnt) { 
    var s = ""; 
    for (var i=0; i<cnt; i++) { s += "-"; } 
    return s; 
  }

  function renderArray( theNode, level ) {
    var aTree = "";
    var aList = theNode.getChildren();
    for (var x in aList) { 
      var p = aList[x];
      if (p.isVisible()) {
        if (aTree.length > 0) { aTree += ", "; }
        aTree += "[\"" + dashes(level) + " " + p.getName() + "\",\"" + imagePath + "/" + p.getFileName() + "\"]";
        var rest = renderArray(p, level+1);
        if (rest.length > 0) { aTree += "," + rest; }
      }
    }
    return aTree;
  }
  return "[" + renderArray( aRoot, 0 ) + "]";
};
  
    
//display the complete tree to be used in a select/menu.
TreeController.prototype.getMenu = function( theRoot ) {
  var self = this;
  var aRoot = (typeof theRoot === "object") ? theRoot : self.getObject((typeof theRoot === "undefined") ? self.getRoot() : theRoot);
  
  function renderTree( theNode ) {
    var aTree = "";
    var aList = theNode.getChildren();
    for (var x in aList) { 
      var p = aList[x];
      if (p.isVisible()) {
        aTree += "<li id=\"" + p.id + "\" rel=\"" + p.getFileName() + "\" title=\"" + p.name +"." + p.extention + "\"><a href=\"#\">" + p.getName() + "</a>" + renderTree(p) + "</li>";
      }
    }
    return (aTree.length === 0) ? "" :  "<ul>" + aTree + "</ul>";
  }
  return renderTree( aRoot );
};
  
    
//display the complete tree to be used in a select/menu.
TreeController.prototype.getList = function( theRoot ) {
  var self = this;
  var aRoot = (typeof theRoot === "object") ? theRoot : self.getObject((typeof theRoot === "undefined") ? self.getRoot() : theRoot);
  
  function renderTree( theNode ) {
    var aTree = "";
    var aList = theNode.getChildren();
    for (var x in aList) { 
      var p = aList[x];
      if (p.isVisible()) {
        aTree += "<li id=\"" + p.getId() + "\" rel=\"" + p.getFileName() + "\">" +
                 p.getName() + renderTree(p) + "</li>";
      }
    }
    return (aTree.length === 0) ? "" :  "<ul>" + aTree + "</ul>";
  }
  
  return renderTree( aRoot );
};
  
    


// The complete tree for the admin part of the essen
TreeController.prototype.getTree = function( theRoot ) {
  var self = this;
  var aRoot = (typeof theRoot === "number") ? self.app.getAtom(theRoot) :
              (typeof theRoot === "object") ? theRoot :
              self.getObject((typeof theRoot === "undefined") ? self.getRoot() : theRoot);
  
  function renderTree( theNode, open, descend ) {
    var aTree = "";
    if (typeof theNode != "undefined") {
      var aList = theNode.getChildren();
      for (var x in aList) { var p = aList[x];
         var name = (p.isActive()) ? p.getName() : "("+p.getName()+")";
         var classes = (open ? "open " : "") +
                       (p.isVisible() ? "" : "invisible ") +
                       (p.isActive() ? "" : "deleted");
           aTree += "<li id=\"id_" + p.getId() + "\" class=\"" + classes + "\"" +
                 " rel=\""+ self.getType(p) + "\"" +
                "><a href=\"#\">" + name + "</a>";
           if (descend > 0) {
             aTree += renderTree(p, false, descend-1);
           }
           aTree += "</li>";
      }
    }
    if (aTree.length === 0) {
       return "";
    } else {
       return "<ul>" + aTree + "</ul>";
    }
  }

  return renderTree( aRoot, false, 99 );
};
  


TreeController.prototype.saveInfo = function( nodeId, finish ) {
  var self = this;
  console.log("FormController.saveInfo: node = " + nodeId );
  
  var anObject = this.getObject(TreeController.toId(nodeId));
  if (typeof anObject !== "undefined") {
     self.context.shownode = anObject.parentId;
     anObject.scrapeFrom(this);
      var F = self.context.req.files;
      
      if ((typeof F !== "undefined") && (typeof F.fileToUpload !== "undefined")) {
        F = F.fileToUpload;
       
        if (F.size !== 0) {
          // find the name of the file 
          var dot = F.name.lastIndexOf(".");
          anObject.setExtention(F.name.substring(dot+1));
          var oldNote = anObject.getNote() || "";
          if (oldNote === "") { anObject.setNote(F.name.substring(0, dot)); }
          var newPath = anObject.getPathName(self);
          
          // move the tmp file to our own datastore 
          console.log("TreeController.saveInfo: moving file from " + F.path + " to " + newPath);
          fs.rename(F.path, newPath, function(err) {
            if (err) {
              console.log(err);
              this.feedBack(false, "unable to rename uploaded file to " + newPath);
            } else {
              anObject.doUpdate(self, finish);
            }
          });
        } else {
          // just delete the tmp file if it's empty
          fs.unlink(F.path, function() {
            anObject.doUpdate(self, finish);
          });
        }
        
      } else {
        console.log("TreeController.saveInfo: no file attached.");
        anObject.doUpdate(self, finish);
      }

  } else {
    this.feedBack(false, "failed to save the data");
    finish();
  }
};


TreeController.prototype.addObject = function( title, refNode, type, kind, finish ) {
  var self = this;
  console.log("Received TreeController - addObject, refnode = " + refNode + ", title = " + title + ", type = " + type + ", kind = " + kind);
  
  var refNodeId = TreeController.toId(refNode);
  var orderNr, aParent;
  var ext = (kind === "folder") ? "xxx" : (kind === "form") ? "" : "---";

  // fetch the parent and sortorder
  if (type === "inside") {
    orderNr = 5;
    aParent = self.app.getAtom(refNodeId);
  } else { 
    // after -> is always at the end -> we never get this !! (worked with previous version of jsTree)
    var refItem = self.app.getAtom(refNodeId);
    orderNr = refItem.sortorder + 10;
    aParent = refItem.parent;
  }

  var basis = cody.Atom.addDefaults({name: title, sortorder: orderNr, extention: ext}, aParent);
  var anAtom = new cody.Atom(basis);
  anAtom.pickParent(self.app.atoms);
  
  // console.log(anAtom);

  anAtom.doUpdate(self, function() {
    self.app.addAtom(anAtom);
    finish( { status: "OK", node: "id_" + anAtom.id } );
  });
  
};

TreeController.prototype.moveObject = function( nodeId, refNode, type, finish ) {
  var self = this;
  // type = "before" / "after" or "last" / "inside"
  console.log("Received TreeController - moveObject, refnode = " + refNode +
    ", node = " + nodeId + ", type = " + type);

  var orderNr;
  var aParent;

  // fetch the parent and insertion point
  if ((type === "inside") || (type === "last")) {
    aParent = self.app.getAtom(cody.TreeController.toId(refNode));
    orderNr = 9999;
  } else {
    var refItem = self.app.getAtom(cody.TreeController.toId(refNode));
    aParent = self.app.getAtom(refItem.parentId);
    orderNr = refItem.sortorder + ((type === "before") ? -5 : +5);
  }

  // fetch the node to be moved
  var anItem = self.app.getAtom(cody.TreeController.toId(nodeId));
  var curParent = self.app.getAtom(anItem.parentId);

  // position in the tree
  anItem.parentId = aParent.id;
  //console.log("TreeController.MovePage: old order = " + anItem.sortorder + " (of " + anItem.id + "), new order = " + orderNr + ", in parent = " + anItem.parentId);
  anItem.sortorder = orderNr;

  try {
    self.respace(aParent, function whenDone() {
      finish( { status: "OK" } );
    });

  } catch (e) {
    console.log("TreeController.MoveItem: Failed to update the Item object.");
    console.log(e);
    finish( { status: "NOK", error: e.toString() } );
  }
};

TreeController.prototype.renameObject = function( title, nodeId, finish ) {
  var self = this;
  console.log("Received TreeController - rename, node = " + nodeId + ", title = " + title);
  
  var anObject = this.getObject(TreeController.toId(nodeId));
  if (typeof anObject !== "undefined") {
    try {
      anObject.setName(title);
      anObject.doUpdate(self, function() {
        self.context.shownode = anObject.id;
        finish( { status: "OK" } );
      });
      
    } catch (e) {
      console.log("TreeController.RenameObject: Failed to update the object - " + e);      
      finish( { status: "NOK", error: e.toString() } );
    }
  } else {
    finish( { status: "NOK"} );
  }
};

TreeController.prototype.deleteObject = function( nodeId, finish ) {
  var self = this;
  var anObject = self.getObject(TreeController.toId(nodeId));
  if (self.app.hasAtomChildren(anObject)) {
    finish({ status: "NOE", error: "not empty"});
    
  } else {
    self.context.shownode = anObject.parentId;
    anObject.doDelete(self, function(err) {
      if (err) {
        finish({status: "NOK", error: err.toString()});    
      } else {
        finish({status: "OK"});    
      }
    });
  }
};
TreeController.prototype.realDeleteObject = function( nodeId, finish ) {
  var self = this;
  this.deleteObject( nodeId, function(msg) {
    if (msg.status === "NOE") {
      self.feedBack(false, "There are still elements below this item");
      finish();
      
    } else if (msg.status === "NOK") {
      self.feedBack(false, "Error deleting this item: " + msg.error);
      finish();   
      
    } else {
      self.feedBack(true, "Item successfully deleted");
      finish();    
      
    }
  });
};


TreeController.prototype.makeSelect = function( type ) {
};


TreeController.prototype.fetchNode = function( nodeId, finish ) {
  console.log("TreeController.FetchNode: nodeId = " + nodeId);
  this.context.atom = this.getObject(TreeController.toId(nodeId));
  if (! this.context.atom) {
    this.gen("NOK,Could not find the requested atom with id = " + nodeId, { "Content-Type": "application/html" });
  } else {
    finish();
  }
};


TreeController.prototype.respace = function( parent, finish ) {
  var self = this;

  var aList = parent.getChildren();

  var nr = 0;
  cody.Application.each(aList, function respaceOnePage(done) {
    var aChild = this;
    nr += 10;
    //console.log("TreeController.Respace: checking '" + aChild.name + "' now = " + aChild.sortorder + " to " + nr);
    if (aChild.getSortOrder() !== nr) {
      aChild.setSortOrder(nr);
      aChild.doUpdate(self, function() {
        done();
      });
    } else {
      done();
    }

  }, function whenDone(err) {
    if (err) { console.log("TreeController - respace: error = " + err); }
    if (typeof finish === "function") { finish(); }

  });

};

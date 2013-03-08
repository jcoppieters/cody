	
//
// Johan Coppieters - mar 2013 - jCMS
//
//
console.log("loading " + module.id);

var mysql = require("mysql");
var jcms = require('./index.js');

module.exports = TreeController;

function TreeController(context) {
	// only called for using my methods
	if (context == undefined) return;

	console.log("TreeController.constructor -> page: ("
              + context.page.itemId + ") " + context.page.title);

	// init inherited controller
	jcms.Controller.call(this, context);
}
TreeController.prototype = new jcms.Controller();


// Next 3 should be overridden
TreeController.prototype.getRoot = function() { 
	return 0; 
};

TreeController.prototype.getType = function(theNode) { 
	return ""; 
};

TreeController.prototype.getFilePath = function() { 
	return ""; 
};

/* required protocol for nodes:
Node.prototype.getAllowedGroups = function() { return ""; }
Node.prototype.hasChildren = function() { return false; }
Node.prototype.isActive = function() { return true; }
Node.prototype.getChildren = function() { return []; }
Node.prototype.getSortOrder = function() {}
Node.prototype.setSortOrder = function(nr) {}
Node.prototype.update = function() {}
Node.prototype.getName = function() {}
Node.prototype.getId = function() {}
*/
			

TreeController.prototype.toId = function(theNode) {
	return parseInt(theNode.substring(3));
};

TreeController.prototype.doRequest = function( finish ) {
	var self = this;

	if (self.context.request == "insert") {
		// a new node was inserted in the tree
		this.gen( this.AddObject( self.getParam("title"), 
								  self.getParam("refnode"), 
								  self.getParam("type"), 
								  self.getParam("kind")) );
		finish("");
		
	} else if (self.context.request == "move") {
		// a  node was being moved around in the tree
		this.gen( this.MoveObject( self.getParam("node"), 
							  	   self.getParam("refnode"), 
								   self.getParam("type")) );
		finish("");
		
	} else if (self.context.request == "rename") {
		// a node has been renamed in the tree
		this.gen( this.RenameObject( self.getParam("title"), 
								     self.getParam("node")) );
		finish("");
					
	} else if (self.context.request == "delete") {
		// request to delete a node from the tree
		this.gen( this.DeleteObject( self.getParam("node") ));
		finish("");
		
	} else if (self.context.request == "select") {
		// generate a input/type=select
		this.gen( this.getList() );
		finish("");
		
	} else if (self.context.request == "fileupload") {
		this.gen( this.UploadFile( this.getFilePath(), self.getParam("node") ));
		finish("");
					
	} else if (self.context.request == "getpage") {
		// get all info and data on this node
		this.FetchNode( self.getParam("node") );
		finish( self.context.fn.replace(".ejs", "-ajax.ejs") );
							
	} else if (self.context.request == "save") {
		// save all info on this node (done by a submit, so we need to redraw the screen, too bad)
		this.SaveInfo( self.getParam("node") );
		finish();
				
	} else {
		// no specific request, just draw the tree...
		finish();
	}
};

TreeController.prototype.gen = function( theString ) {
    res.writeHead(404, { "Content-Type": "application/json" });
	this.context.res.writeHead();
	this.context.res.write(theString);
	this.context.res.end()
}

// display the complete tree to be used in a select/menu.
TreeController.prototype.renderList = function( theNode ) {
	var self = this;
	
	var aTree = "";
	var aList = theNode.getChildren();
	for (var x in aList) { var p = aList[x];
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
	for (var x in aList) { var p = aList[x];
	   var name = (p.isActive()) ? p.getName() : "("+p.getName()+")";
       aTree += "<li id=\"id_" + p.getId() + "\"" + (open ? " class=\"open\"" : "") +
       			(p.isActive() ? "" : " class=\"deleted\"") + 
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
}
	
TreeController.prototype.getTree = function() {
	return this.renderTree( this.getRoot(), false, 99 );
}



TreeController.prototype.AddObject = function( title, refNode, type, kind ) {
};
TreeController.prototype.MoveObject = function( nodeId, refNode, type ) {
};
TreeController.prototype.RenameObject = function( title, nodeId ) {
};
TreeController.prototype.DeleteObject = function( nodeId ) {
};
TreeController.prototype.MakeSelect = function( type ) {
};
TreeController.prototype.UploadFile = function( filePath, nodeId ) {
};
TreeController.prototype.FetchNode = function( nodeId ) {
};
TreeController.prototype.SaveInfo = function( nodeId ) {
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
	void SaveInfo( String theNode ) {
		try {
			TObject anObject = this.fApplication.GetObject(Integer.parseInt(theNode));
			anObject.fExtention = this.UploadFile( this.getFilePath(), theNode );
			if (anObject.fExtention.length() == 0)
				anObject.fExtention =  self.getParam("extention");

			// update all other object info (TPage -> db:pages)
			anObject.fName = self.getParam("name");
			anObject.fCaption = self.getParam("caption");
			anObject.doUpdate(this.fRequest);
			
			// save the page for next http transaction
			this.context.savedObject", anObject);

		} catch (Exception e) {
			e.printStackTrace();
			TApplication.printLog("TTreeController.SaveInfo: failed to save (" + theNode + ")");
		}
	}

	void FetchNode(String theNode) {
		TObject anObject = this.fApplication.GetObject(toId(theNode));
		this.context.object = anObject;
	}
	
	
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
	
	
	String RenameObject( String theTitle, String theNode ) {
		TApplication.printLog("Received TTreeController - rename, node = " + theNode + ", title = " + theTitle);
			
		TObject anObject = this.fApplication.GetObject(toId(theNode));
		if (anObject != null) {
			anObject.fName = theTitle;

			try {
				anObject.doUpdate(this.fRequest);
				return "OK";
			} catch (Exception e) {
				TApplication.printLog("TTreeController.RenameObject: Failed to update the object.");			
				return "NOK";
			}
		} else
			return "NOK";
	}
	
	String MoveObject( String theNode, String theRefNode, String theType ) {
   		// type = "before", "after" or "inside"
		TApplication.printLog("Received TTreeController - move, refnode = " +theRefNode+ 
							  ", node = " + theNode + ", type = " + theType);
		
		int orderNr;
		TObject aParent;		

		// fetch the parent and insertion point
		if (theType.equalsIgnoreCase("inside")) {
			aParent = this.fApplication.GetObject(toId(theRefNode));
			orderNr = 9999;
		} else {	
			TObject anObject = this.fApplication.GetObject(toId(theRefNode));
			aParent = this.fApplication.GetObject(anObject.fParentId);
			orderNr = anObject.fSortOrder + (theType.equalsIgnoreCase("before") ? -5 : +5);
		}
		
		// fetch the node to be moved
		TObject anObject = this.fApplication.GetObject(toId(theNode));
		
		// position in the tree
		anObject.fParentId = aParent.fId;
		anObject.fSortOrder = orderNr;
		
		try {
			anObject.doUpdate(this.fRequest); //TODO should not be needed, check it.
			this.Respace(aParent);
			return "OK";
			
		} catch (Exception e) {
			TApplication.printLog("TTreeController.MoveObject: Failed to update the object.");
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

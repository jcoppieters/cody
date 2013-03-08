//
// Johan Coppieters - jan 2013 - jWorks
//
//
var mysql = require('mysql');
var jcms = require('./index.js');

console.log("loading " + module.id);

module.exports = SitemapController;

function SitemapController(context) {
 	console.log("SitemapController.constructor -> page: ("
              + context.page.itemId + ") " + context.page.title);
  
  // init inherited controller
  jcms.TreeController.call(this, context);
}

SitemapController.prototype = new jcms.TreeController();


SitemapController.prototype.doRequest = function( finish ) {
  var self = this;
  
  self.context.fn = "admin/sitemap.ejs";
  
  if (self.context.request == "realdelete") {
	// request to delete a node from the tree
	var aResult = this.realDeletePage( this.getParam("node") );
	
	if (aResult == "NAL")
		this.feedback(false, "You are not allowed to delete this item");
		
	else if (aResult == "NOE")
		this.feedback(false, "This page still contains subitems");
		
	else if (aResult == "NOK")
		this.feedback(false, "Failed to delete the page");
			
	finish();
		
  } else if (self.context.request == "adjust") {
	// get all info and data on this node
	this.AdjustElements( this.getParam("node") );
	finish();

  } else {
	  // this.super.doRequest( finish );
      jcms.TreeController.prototype.doRequest.call(this, finish);
    
  }
}

/* Overridden - Config functions */
function Root(aList, id, name) {
  this.getId = function() { return id; }
  this.getName = function() { return name; }
  this.hasChildren = function() { return true; };
  this.getChildren = function() { return aList; }
 }
 
SitemapController.prototype.getRoot = function() {
	return new Root(this.context.app.roots, 0, "Website"); 
};

SitemapController.prototype.getType = function(theNode) { 
	return ""; 
};

SitemapController.prototype.getFilePath = function() { 
	return ""; 
};


/* Overridden - Action functions */

SitemapController.prototype.AddObject = function( title, refNode, type, kind ) {
};
SitemapController.prototype.MoveObject = function( nodeId, refNode, type ) {
};
SitemapController.prototype.RenameObject = function( title, nodeId ) {
};
SitemapController.prototype.DeleteObject = function( nodeId ) {
};
SitemapController.prototype.MakeSelect = function( type ) {
};
SitemapController.prototype.UploadFile = function( filePath, nodeId ) {
};
SitemapController.prototype.FetchNode = function( theNode ) {
	var self = this;
	// just switch the page from our context ??
	
	var language = this.context.page.language;
	var editPath = language + "/" + self.toId(theNode);
	
	var aPage = self.context.app.urls[editPath];
	if (! self.isAllowed(aPage)) return "NAL";
	
	// replace our page...
	self.context.page = aPage;
	
	//TODO: get all elements connected to this page
	self.context.editElements = [];
	
	console.log("SitemapController.FetchNode: node = " + theNode + ", language = " + language + " => " + self.context.page.item.id);

};

SitemapController.prototype.SaveInfo = function( nodeId ) {
};

SitemapController.prototype.toId = function( nodeId ) {
	return nodeId.substring(3);
};


/* Controller specific, called from template */

SitemapController.prototype.getAdminTree = function() {
	return this.renderTree( new Root(this.context.app.admins, 1, "Admin"), false, 99 );
}

SitemapController.prototype.getGlobalTree = function() {
	return this.renderTree( new Root(this.context.app.globals, 1, "Globals"), false, 99 );
}


SitemapController.prototype.realDelete = function( theNode ) {
};

SitemapController.prototype.AdjustElements = function( theNode ) {
};


SitemapController.prototype.isAllowed = function( theNode ) {
		
	var aUserDomain = "";
	var aRecord = this.getLogin();
	if (aRecord != null) {
		var aDom = aRecord.domain;
		if (aDom != null) aUserDomain = aDom;
	}
	
	var anItemDomain = theNode.getAllowedGroups();
	
	console.log("TSiteMapController.isAllowed: user = '" + aUserDomain + "', item = '" + anItemDomain + "'");

	if (aUserDomain.length == 0) return false;
	if ((aUserDomain=="*") || (aUserDomain=="rWorks")) return true;
		
	if ((anItemDomain.equals=="*") || (anItemDomain.length == 0)) return true;
	
	var aList = anItemDomain.split(",");
	for (var x in aList) {
		if (aList[x]==aUserDomain) return true;
	}
	
	return false;
};


/*
	void UpdateElements(TPage thePage) {
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
	
	void UpdateItem(TPage thePage) throws Exception {
		// update all item info (TItem -> db:items)
		TItem anItem = thePage.fItem;
		anItem.setDated(this.getParam("dated"));
		anItem.setValidFrom(this.getParam("validfrom"));
		anItem.setValidTo(this.getParam("validto"));
		anItem.fNeedsLogin = "Y".equalsIgnoreCase(this.getParam("needslogin"));
		anItem.fShowContent = TApplication.asChar(this.getParam("showcontent"));
		anItem.setAllowedGroups(this.getParam("allowedgroups"));
		anItem.setTemplate(this.getParam("template"), this.fApplication);			
		anItem.setFormId(this.getParam("form"), this.fApplication);
		anItem.fOrderBy = TApplication.asChar(this.getParam("orderby"));
		anItem.doUpdate(this.fRequest);
	}
	
	void UpdatePage(TPage thePage) throws Exception {
		// update all page info (TPage -> db:pages)
		thePage.fActive = ! "Y".equalsIgnoreCase(this.getParam("deleted")); 
		thePage.fKeywords = this.getParam("keywords");
		thePage.fDescription = this.getParam("description");
		thePage.setLink(this.getParam("link"));
		thePage.doUpdate(this.fRequest);
		
		// save the page for next http transaction
		this.fRequest.setVar(TApplication.kRequest, "savedPage", thePage);
	}
	
	void SaveInfo( String theNode ) {
		String aLan = this.fRequest.getLanguage();
		try {
			TPage aPage = this.fApplication.GetPage(aLan, Integer.parseInt(theNode));
			this.UpdatePage(aPage);
			this.UpdateItem(aPage);
			this.UpdateElements(aPage);
			
			// not only the "order-by" field could have been changed, but also the title, the date, etc ...
			this.fApplication.BuildSiteMap();
			
		} catch (Exception e) {
			console.log("TSiteMapController.SaveInfo: failed to save (" + theNode + "/" + aLan + ")");
			e.printStackTrace();

		}
	}

	
	String SaveData(String thePageId, String theData) {		
		try {
			int theId = Integer.parseInt(thePageId.substring(3));
			TPage aPage = this.fApplication.GetPage(this.fRequest.getLanguage(), theId);
			
			if (! this.isAllowed(aPage)) return "NAL";
			
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
	
	
	String FetchNode(String theNode) {
		try {
			String aLan = this.fRequest.getLanguage();
			console.log("TSitemapController.FetchNode: node = " + theNode + ", language = " + aLan);
			TPage aPage = this.fApplication.GetPage(aLan, Integer.parseInt(theNode.substring(3)));
			
			if (! this.isAllowed(aPage)) return "NAL";
			
			TContent aContent = new TContent(this.fRequest, aPage);
			aContent.Init();
			
			this.fRequest.setVar(TApplication.kRequest, "editLanguage", aLan);
			this.fRequest.setVar(TApplication.kRequest, "editContent", aContent);
			this.fRequest.setVar(TApplication.kRequest, "editElements", aContent.fElements);
			this.fRequest.setVar(TApplication.kRequest, "editData", aContent.fData);
			this.fRequest.setVar(TApplication.kRequest, "editPage", aPage);
			this.fRequest.setVar(TApplication.kRequest, "editItem", aPage.fItem);
			
			ArrayList<TTemplate> aTList = new ArrayList<TTemplate>( this.fApplication.fTemplates.values() );
			Collections.sort(aTList);
			this.fRequest.setVar(TApplication.kRequest, "templates", aTList);
			
			ArrayList<TForm> aFList = new ArrayList<TForm>( this.fApplication.fForms.values() );
			Collections.sort(aFList);
			this.fRequest.setVar(TApplication.kRequest, "forms", aFList);
			
		} catch (Exception e) {
			console.log("TSitemapController.FetchNode: failed to fetch a page.\n" + e.toString());
			return "NOK";
		}
		return "";
	}
	
	
	String DeletePage( String theNode ) {
		console.log("Received TSitemapController - delete, node = " + theNode);
		
		try {
			int anItemId = Integer.parseInt(theNode.substring(3));
			TPage aPage = this.fApplication.GetPage(this.fRequest.getLanguage(), anItemId);
			
			if (! this.isAllowed(aPage)) return "NAL";

			aPage.doDelete(this.fRequest);
			return "OK";
			
		} catch (Exception e) {
			console.log("TSiteMapController.DeletePage: Failed to delete the TPage or TItem object.");	
			return "NOK";
		}
	}
	
	String RealDeletePage( String theNode ) {
		console.log("Received TSitemapController - realdelete, node = " + theNode);
		
		try {
			int anItemId = Integer.parseInt(theNode);
			
			// just save the current page should something fail, this keeps the tree navigation open at the correct place
			TPage aCurrent = this.fApplication.GetPage(this.fRequest.getLanguage(), anItemId);
			this.fRequest.setVar(TApplication.kRequest, "savedPage", aCurrent);
			
			if (! this.isAllowed(aCurrent)) return "NAL";

			// delete all language versions of this page
			for (TLanguage aLan: this.fApplication.GetLanguages()) {
				TPage aPage = this.fApplication.GetPage(aLan.fId, anItemId);
				if (aPage != null) {
					if (aPage.fChildren.isEmpty())
						aPage.doRealDelete(this.fRequest);
					else	
						return "NOE";
				}
			}
			// delete the item
			TItem anItem = this.fApplication.GetItem(anItemId);
			anItem.doRealDelete(this.fRequest);
			
			// if everything went well, select the parent.
			this.fRequest.setVar(TApplication.kRequest, "savedPage", aCurrent.fParent);

			return "OK";
			
		} catch (Exception e) {
			console.log("TSiteMapController.DeletePage: Failed to delete the TPage or TItem object.");
			e.printStackTrace();
			return "NOK";
		}
	}
	
	String RenamePage( String theTitle, String theNode ) {
		console.log("Received TSitemapController - rename, node = " + theNode + ", title = " + theTitle);
			
		TPage aPage = this.fApplication.GetPage(this.fRequest.getLanguage(), Integer.parseInt(theNode.substring(3)));
		if (aPage != null) {
			
			if (! this.isAllowed(aPage)) return "NAL";

			aPage.fTitle = theTitle;

			try {
				aPage.doUpdate(this.fRequest);
				if ((this.fApplication.isDefaultLanguage(aPage.fLanguage)) || (aPage.fItem.fName.equals(TItem.kDefaultName))) {
					aPage.fItem.fName = theTitle;
					aPage.fItem.doUpdate(this.fRequest);
				}
				return "OK";
			} catch (Exception e) {
				console.log("TSiteMapController.RenamePage: Failed to update the TPage or TItem object.");			
				return "NOK";
			}
		} else
			return "NOK";
	}
	
	String MovePage( String theNode, String theRefNode, String theType ) {
   		// type = "before", "after" or "inside"
		console.log("Received TSitemapController - move, refnode = " +theRefNode+ 
							  ", node = " + theNode + ", type = " + theType);
		
		int orderNr;
		TItem aParent;		

		// fetch the parent and insertion point
		if (theType.equalsIgnoreCase("inside")) {
			aParent = this.fApplication.GetItem(Integer.parseInt(theRefNode.substring(3)));
			orderNr = 9999;
		} else {	
			TItem anItem = this.fApplication.GetItem(Integer.parseInt(theRefNode.substring(3)));
			aParent = this.fApplication.GetItem(anItem.fParentId);
			orderNr = anItem.fSortOrder + (theType.equalsIgnoreCase("before") ? -5 : +5);
		}
		
		// fetch the node to be moved
		TItem anItem = this.fApplication.GetItem(Integer.parseInt(theNode.substring(3)));
		TItem curParent = this.fApplication.GetItem(anItem.fParentId);

		// check the new target parent
		if (! this.isAllowed(aParent)) return "NAL";
		
		// check the current parent
		if (! this.isAllowed(curParent)) return "NAL";

			
		// position in the tree
		anItem.fParentId = aParent.fId;
		console.log("TSiteMapController.MovePage: old order = " + anItem.fSortOrder + ", new order = " + orderNr);
		anItem.fSortOrder = orderNr;
		
		try {
			// anItem.doUpdate(this.fRequest); -> done in respace too
			this.fApplication.BuildSiteMap();
			this.Respace(aParent);
			return "OK";
		} catch (Exception e) {
			console.log("TSiteMapController.MovePage: Failed to update the TItem object.");
			return "NOK";
		}
	}
	
	String AddPage( String theTitle, String theRefNode, String theType ) {
		console.log("Received TSitemapController - insert, refnode = " +theRefNode+ 
							  ", title = " + theTitle + ", type = " + theType);
		
		int user = 0;
		int orderNr;
		TItem aParent;

		// fetch the user id
		TRecord aRecord = this.fRequest.getLogin();
		if (aRecord != null) {
			String aUserId = (String) aRecord.get("id");
			if (aUserId != null) user = Integer.parseInt(aUserId);
		}
		
		// fetch the parent
		if (theType.equalsIgnoreCase("inside")) {
			// is only possible if parent is empty
			orderNr = 10;
			aParent = this.fApplication.GetItem(Integer.parseInt(theRefNode.substring(3)));
		} else { 
			// after -> is always at the end
			TItem anItem = this.fApplication.GetItem(Integer.parseInt(theRefNode.substring(3)));
			orderNr = anItem.fSortOrder + 10;
			aParent = this.fApplication.GetItem(anItem.fParentId);
		}
		
		if (! this.isAllowed(aParent)) return "NAL";
		
		// fetch the default template
		int aDefaultTemplateId = aParent.fTemplate.getDefaultChildTemplate();
		TTemplate aTemplate = this.fApplication.GetTemplate(aDefaultTemplateId);
		
		// make the item
		TItem anItem = new TItem(theTitle, aParent, user, aTemplate, orderNr);
		
		try {
			anItem.doInsert(this.fRequest);
			this.fApplication.fItems.add(anItem);

			
			// make the page in all languages
			for (TLanguage aLan: this.fApplication.GetLanguages()) {
				TPage aPage = new TPage(anItem, aLan.fId, theTitle);
				aPage.setPages(this.fApplication.fPages);
				aPage.doInsert(this.fRequest);
				aPage.add();
				
				// add default elements from template and insert in the database
				TContent aContent = new TContent(this.fRequest, aPage);
				aContent.FetchElements(aPage.fLanguage, - aDefaultTemplateId);
				aContent.doInsertElements();
			}
			this.fApplication.BuildSiteMap();
		} catch (Exception e) {
			console.log("TSiteMapController.AddPage: Failed to create or insert TItem and TPage object.");
		}
		return "id_" + anItem.fId;
	}
	
	String OneLevel( TPage theLevel, boolean open, int descend ) {
       String aTree = "";
       for (TPage p: theLevel.fChildren) {
    	   if (p.fActive)
               aTree += "<li id=\"id_" + p.fItemId + "\"" + (open ? " class=\"open\"" : "") + 
	   					(p.fItem.fShowContent == 'Y' ? " rel=\"file\">" :  " rel=\"folder\">") +
     			        "<a href=\"#\"><ins>&nbsp;</ins>" + p.fTitle + "</a>";
    	   else
    		   aTree += "<li id=\"id_" + p.fItemId +  
    		   			"\" class=\"deleted" + (open ? " open\"" : "\"") + 
    		   			(p.fItem.fShowContent == 'Y' ? " rel=\"file\">" :  " rel=\"folder\">") +
    		   			"<a href=\"#\"><ins>&nbsp;</ins>(" + p.fTitle + ")</a>";
           if (descend > 0)
        	   aTree += OneLevel(p, false, descend-1);
           aTree += "</li>\n";
       }
       if (aTree.length() == 0)
    	   return "";
       else
    	   return "<ul>" + aTree + "</ul>";
	}
	
	
	public String getTree() {
		return OneLevel( this.fApplication.GetRoot(this.fRequest.getLanguage()), false, 99);
	}
	
	public String getSysTree() {
       String aTree = "";
       TPage aRoot = this.fApplication.GetPage(this.fRequest.getLanguage(), TItem.kAdminItemId);
       for (TPage p: aRoot.fChildren) {
    	   if (p.fActive)
               aTree += "<li id=\"id_" + p.fItemId + "\" rel=\"file\">" +
     			        "<a href=\"#\"><ins>&nbsp;</ins>" + p.fTitle + "</a>";
    	   else
    		   aTree += "<li id=\"id_" + p.fItemId + "class=\"deleted\" rel=\"file\">" +
    		   			"<a href=\"#\"><ins>&nbsp;</ins>(" + p.fTitle + ")</a>";
    	   
    	   aTree += OneLevel(p, false, 99) + "</li>\n";
        }
        return "<ul>" + aTree + "</ul>";
	}
	
	public String getSpecialTree(int theParent) {
        String aTree = "";
        String aLan = this.fRequest.getLanguage();
        ArrayList<TPage> aList = this.fApplication.GetSpecials();
        for (TPage p: aList) {
     	   if ((p.fItem.fParentId == theParent) && (p.fItemId >= 50) && (p.fLanguage.equals(aLan)))
                aTree += "<li id=\"id_" + p.fItemId + "\" rel=\"file\">" +
      			         "<a href=\"#\"><ins>&nbsp;</ins>" + p.fTitle + "</a> " + 
                		 OneLevel(p, false, 99) + "</li>";
        }
        return "<ul>" + aTree + "</ul>";	
	}
	
	public String getGlobalTree() {
        return getSpecialTree(TItem.kOrhpanItemId);
	}
	
	public String getFooterTree() {
        return getSpecialTree(TItem.kFooterItemId);
	}
	
	public String genPageTree(int theRoot) {
		console.log("TSiteMapController.getPageTree: " + theRoot);
	    TPage aRoot = this.fApplication.GetPage(this.fRequest.getLanguage(), theRoot);
	    if (aRoot != null)
        	return OneLevel(aRoot, false, 99);
	    else
	    	return "<!-- empty tree " + theRoot + " root page not found -->";
	}
	public String getPageTree() {
	    return genPageTree( TApplication.asNum(this.fRequest.getStr(TApplication.kRequest, "root"), -99) );
	}
	
	
	private void Respace(TItem parent) throws Exception {
		// Find all children, any page of the item will do, they all have the same children in any language
		TPage aPage = this.fApplication.GetPage(this.fRequest.getLanguage(), parent.fId);
	
		int nr = 0;
		for (TPage cp: aPage.fChildren) {
			nr += 10;
			console.log("TSiteMapController.Respace: checking '" + cp.fItem.fName + "' now = "+cp.fItem.fSortOrder + " to " + nr);
			if (cp.fItem.fSortOrder != nr) {
				cp.fItem.fSortOrder = nr;
				cp.fItem.doUpdate(this.fRequest);
			}
		}
	}
}
*/
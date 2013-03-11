//
// Johan Coppieters - jan 2013 - jWorks
//
//
console.log("loading " + module.id);

var jcms = require("./index.js");

module.exports = Page;

function Page(basis, app) {
  // copy from basis
  for (var a in basis) {
    if (basis.hasOwnProperty(a))
      this[a] = basis[a];
  }
  
  // replace 'item' by the real object and add 'itemId'
  this.itemId = this.item;
  this.item = app.getItem(this.itemId);
  if (this.item == undefined)
    app.err("Application.fetchPages", "did not find item for page " + this.itemId + " / " + this.title);
}

Page.prototype.addTo = function(app) {
  // add to the list of all pages
  app.pages.push(this);
  
  // build url with its unique id (no check needed) and store in the hashmap
  this.url = this.language + "/" + this.itemId;
  app.urls[this.url] = this;
  
  // if we have a user defined link, store it as well
  if (this.link != '') {
    // replace the page its url by something better
    this.url = this.language + "/" + this.link;
    
    // check if this link is not already used
    if (app.urls[this.url] != undefined)
      throw new Error("Application.fetchPages - double link: " + this.url);
    else
      app.urls[this.url] = this;
    }
};

Page.prototype.addRoot = function() {
  function goUp(aPage) {
    if (aPage.item.parentId < 0)
      return aPage;
    else
      return goUp(aPage.parent);
  }
  this.root = goUp(this);
};

Page.prototype.addChildren = function(list) {
  
  // loop through all pages and find pages having my parent id and language
  this.children = [];
  for (var i = 0; i < list.length; i++) {
    if ((list[i].item.parentId == this.itemId) && (list[i].language == this.language)) {
      // parent and language match -> add to my children
      this.children.push(list[i]);
      
      // this is done more than once... better solution?
      list[i].parent = this;
    }
  }
  if (this.children.length > 1) {
    this.sortChildren(this.item.orderby);
    // console.log("sorted children of " + this.title + " -> " + this.item.orderby);
    // for(var i in this.children) console.log(" " + this.children[i].title);
  }
};

Page.prototype.sortChildren = function(order) {
  var kEqual = 0, kBefore = -1; kAfter = 1;
  
  this.children.sort( function(a, b) {
    if (a == b)
      return kEqual;
      
    if (order == jcms.Item.kAlphabetical)
      return a.title.localeCompare(b.title);
      
    if (order == jcms.Item.kDate)
      return b.item.dated.getTime() - a.item.dated.getTime();
      
    if (order == jcms.Item.kManual)
      return a.item.sortorder - b.item.sortorder;
    
    console.log("Page.sortChildren -> We should't be here... orderby = " + order);
    return kEqual;
  });
};



Page.prototype.getController = function(context) {
  return this.item.template.getController(context);
};
Page.prototype.getView = function() {
  return this.item.template.getView();
};

Page.prototype.getContent = function(connection) {
  var self = this;
  
  connection.query(
     "select data from content where item = ? and language = ?",
     [this.itemId, this.language],
     function(err, result) {
        self.content = {};
        
        // rWorks databases only have 1 content record per page
        //  jCMS should have multiple, with a name
        //  this name should be used as index into content[]
        if (result.length == 0) {
          self.content[0] = "";
          // console.log("no content for " + self.title + " -> nothing");
        } else {
          for (var i = 0; i < result.length; i++) {
            self.content[i] = (result[i].data == null) ? "" : result[i].data;
            // console.log(self.title + " -> " + self.content[i].length + " bytes");
          }
        }
        
      });
};

Page.prototype.getDisplay = function() {
  // check if this page is marked as: "show first subitem"
  if ((this.item.showcontent == 'S') && (this.children.length > 0))
    return this.children[0].getDisplay();
  else
    return this;
};


Page.prototype.shortString = function() {
  return  this.title + " ("+ this.item.id + "/" + this.item.parentId + "), order = " + this.item.orderby + ", content = " +
                  ((this.content != undefined) ? (this.content[0].length + " bytes") : "none");
};
Page.prototype.contentLength = function() {
	return (this.content != undefined) ? this.content[0].length : 0;
};

//
// Tree interface requirements
//
Page.prototype.getAllowedGroups = function() {
	return this.item.getAllowedgroups();
};
Page.prototype.hasChildren = function() {
	return (this.children.length > 1);
};
Page.prototype.isActive = function() { 
	return (this.active == 'Y'); 
}

Page.prototype.getChildren = function() {
	return this.children;
};
Page.prototype.getSortOrder = function() {
	return this.item.sortorder;
};
Page.prototype.setSortOrder = function(nr) {
	this.item.sortorder = nr;
};
Page.prototype.update = function() {
	console.log("update page " + this.item.id + " - " + this.title);
};
Page.prototype.getName = function() {
	return this.title;
};
Page.prototype.getId = function() {
	return this.item.id;
};

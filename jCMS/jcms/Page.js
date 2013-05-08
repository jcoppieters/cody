//
// Johan Coppieters - jan 2013 - jWorks
//
//
console.log("loading " + module.id);

var jcms = require("./index.js");


function Page(basis, app) {
  // copy from basis
  for (var a in basis) {
    if (basis.hasOwnProperty(a)) {
      this[a] = basis[a];
    }
  }

  // replace 'item' (an id) by the real object and add 'itemId'
  this.itemId = this.item;
  this.item = app.getItem(this.itemId);
  if (typeof this.item == "undefined") {
    app.err("Application.fetchPages", "did not find item for page " + this.itemId + " / " + this.title);
  }
}
module.exports = Page;


Page.trim = function (url) {
  return url.replace("/","").replace(" ", "");
};

Page.addDefaults = function(basis, item) {
  
  if (typeof item == "undefined") { item = {}; }
  
  basis.item = basis.item || item.id;
  basis.language = basis.language || jcms.Application.kDefaultLanguage;
  
  basis.title = basis.title || item.name || jcms.Item.kDefaultName;
  basis.created = basis.created || new Date();
  basis.updated = basis.updated || new Date();
  basis.link = basis.link || Page.trim(basis.title);
  basis.keywords = basis.keywords || "";
  basis.description = basis.description || "";
  basis.active = basis.active || "Y";
  basis.content =  basis.content || { 0: "" };
  
  return basis;
};

Page.loadPages = function(connection, store) {
  connection.query('select * from pages', [], function(err, result) {
    store(result);
  });
};
Page.loadLanguages = function(connection, store) {
  connection.query('select * from languages order by sortorder', [], function(err, result) {
    store(result);
  });
};


Page.prototype.addTo = function(app) {
  // add to the list of all pages
  app.pages.push(this);
  
  // build url with its unique id (no check needed) and store in the hashmap
  this.url = this.language + "/" + this.itemId;
  app.urls[this.url] = this;
  
  if (! this.setLink(this.link, app, true) ) {
    throw new Error("Application.fetchPages - double link: " + this.url);
  }
};

Page.prototype.setLink = function(link, app, isNew) {
  // if we have a user defined link, store it in the url field as well in the app's url hashmap
  
  // delete the current link from the app's hashmap
  if (isNew !== true) {
    if ((typeof this.link !== "undefined") && (this.link !== "")) {
      delete app.urls[this.language + "/" + this.link];
    }
  }
  
  if (link !== '') {
    // check if this link is not already used
   if (isNew === true) {
      if (app.urls[this.language + "/" + link]) {
        return false;
      }
    }
    // replace the page its url by something better (than "language/id")
    var url = this.language + "/" + link;
    
    app.urls[url] = this;
    this.url = url;
  }
  this.link = link;
  return true;
};

Page.prototype.addRoot = function() {
  function goUp(aPage) {
    if (aPage.item.parentId < 0) {
      return aPage;
    } else {
      return goUp(aPage.parent);
    }
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
    // console.log("Page.addChildren -> sorted children of " + this.title + " -> " + this.item.orderby);
    // for(var i in this.children) console.log(" " + this.children[i].item.sortorder + ". " + this.children[i].title);
  }
};

Page.prototype.sortChildren = function(order) {
  var kEqual = 0; // kBefore = -1, kAfter = 1;
  
  this.children.sort( function(a, b) {
    if (a == b) {
      return kEqual;
    }
      
    if (order == jcms.Item.kAlphabetical) {
      return a.title.localeCompare(b.title);
    }
      
    if (order == jcms.Item.kDate) {
      return b.item.dated.getTime() - a.item.dated.getTime();
    }
      
    if (order == jcms.Item.kManual) {
      return a.item.sortorder - b.item.sortorder;
    }
    
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
  
  //todo: replace content by elements...
  //TODO: alter table elements string -> data = text, object -> atom
  connection.query(
     "select data from content where item = ? and language = ?",
     [this.itemId, this.language],
     function(err, result) {
        self.content = {};
        
        // rWorks databases only have 1 content record per page
        //  jCMS should have multiple, with a name
        //  this name should be used as index into content[]
        if (result.length === 0) {
          self.content[0] = "";
          // console.log("no content for " + self.title + " -> nothing");
        } else {
          for (var i = 0; i < result.length; i++) {
            self.content[i] = (result[i].data === null) ? "" : result[i].data;
            // console.log(self.title + " -> " + self.content[i].length + " bytes");
          }
        }
        
      });
};

Page.prototype.getDisplay = function() {
  // check if this page is marked as: "show first subitem"
  if ((this.item.showcontent == 'S') && (this.children.length > 0)) {
    return this.children[0].getDisplay();
  } else {
    return this;
  }
};


Page.prototype.shortString = function() {
  return  this.title + " ("+ this.item.id + "/" + this.item.parentId + "), order = " + this.item.orderby + ", content = " +
                  ((typeof this.content != "undefined") ? (this.content[0].length + " bytes") : "none");
};
Page.prototype.contentLength = function() {
  return (typeof this.content != "undefined") ? this.content[0].length : 0;
};

Page.prototype.needsLogin = function() {
  return (this.item) && (this.item.needslogin === "Y");
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
};
Page.prototype.isVisible = function() { 
  var now = new Date();
  // console.log(this.title + " - visible = " + (this.active == 'Y') + "/" + (this.item.validfrom <= now) + "/" + (this.item.validto >= now));
  return (this.active == 'Y') && (this.item.validfrom <= now) && (this.item.validto >= now); 
};

Page.prototype.getChildren = function() {
  return this.children;
};
Page.prototype.getSortOrder = function() {
  return this.item.sortorder;
};
Page.prototype.setSortOrder = function(nr) {
  this.item.sortorder = nr;
};

Page.prototype.getName = function() {
  return this.title;
};
Page.prototype.setName = function(name) {
  this.title = name;
};
Page.prototype.getId = function() {
  return this.item.id;
};


Page.prototype.scrapeFrom = function(controller) {
  var self = this;
  // get all page info from the controller
  self.title = controller.getParam("title", self.title); 
  self.active = controller.getParam("active"); 
  self.keywords = controller.getParam("keywords");
  self.description = controller.getParam("description");
  self.setLink(controller.getParam("link"), controller.app, false);
  
  // missing: updated (automatically on doUpdate), created (invariable), language (invariable)
};

Page.prototype.doUpdate = function(controller, next, isNew) {
  var self = this;
  if (self.link === "") { self.link = Page.trim(self.title); }
  var values = [self.title, self.link, self.active, self.keywords, self.description, self.itemId, self.language];
  
  // new or existing record?
  if (isNew) {
    console.log("Page.doUpdate -> insert page " + self.title);
    controller.query("insert into pages (title, link, active, keywords, description , updated, created, item, language) " +
                     "values (?, ?, ?, ?, ?, now(), now(), ?, ?)", values,
      function(err, result) {
        if (err) { 
          console.log("Page.doUpdate -> error inserting page: " + self.language + "/" + self.itemId);
          console.log(err); 
        } else {
          console.log("Page.doUpdate -> inserted page: " + self.language + "/" + self.itemId);
          self.created = self.updated = new Date();
          if (typeof next == "function") { next.call(self, controller); }
        }
    });
    
  } else {
    console.log("Page.doUpdate -> update page " + self.itemId + " - " + self.title);
    controller.query("update pages set title = ?, link = ?, active = ?, keywords = ?, description = ?, updated = now() " +
                     " where item = ? and language = ?", values,
        function(err) {
          if (err) { 
            console.log("Page.doUpdate -> error updating page: " + self.language + "/" + self.itemId);
            console.log(err); 
          } else {
            console.log("Page.doUpdate -> updated page: " + self.language + "/" + self.itemId);
            self.updated = new Date();
           if (typeof next == "function") { next.call(self, controller); }
          }
    });
  }
};

Page.prototype.doDelete = function(controller, next) {
	var self = this;

  // should NOT be used !!
  console.log("ERROR: should not be used -- delete page " + self.language + "/" + this.item.id + " - " + this.title);
  controller.query("delete from pages where item = ? and language = ?",
      [self.itemId, self.language],
      function(err) {
        if (err) { 
          console.log(err); 
        } else {
          console.log("Page.doDelete -> deleted page: " + self.language + "/" + self.itemId);
          if (typeof next == "function") { next.call(self, controller); }
        }
  });
};

Page.prototype.doDeactivate = function(controller, next) {
  var self = this;
  console.log("Page.doDeactivate -> deactive page " + self.language + "/" + self.itemId + " - " + self.title);
  this.active = 'N';
  controller.query("update pages set active = 'N' where item = ? and language = ?",
      [self.itemId, self.language],
      function(err) {
        if (err) { 
          console.log(err); 
        } else {
          console.log("Page.doDeactivate -> deactived page: " + self.language + "/" + self.itemId);
            if (typeof next == "function") { next.call(self, controller); }
        }
  });
};

Page.prototype.updateContent = function(controller, id, content, next) {
  var self = this;
  
  //TODO: pass id to query once the content table is extended
  console.log("Page.updateContent -> " + self.language + "/" + self.itemId + " - id = " + id);
  controller.query("update content set data = ? where item = ? and language = ?",
      [content, self.itemId, self.language], next);
};


Page.prototype.deleteElements = function( whenDone ) {
  // delete all elements with this.language = elements.language and this.id = elements.page
  whenDone();
};

Page.prototype.copyElements = function( language, id, whenDone ) {
  // copy all elements with language = elements.language and this.id = elements.page
  whenDone();
};


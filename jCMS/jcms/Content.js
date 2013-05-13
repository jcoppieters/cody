//
// Johan Coppieters - may 2013 - jCMS
//
//
console.log("loading " + module.id);

var jcms = require("./index.js");


function Content(basis, page, app) {
  // copy from basis
  for (var a in basis) {
    if (basis.hasOwnProperty(a)) {
      this[a] = basis[a];
    }
  }
  this.data = this.data || "";
  this.kind = this.kind || "T";
  this.sortorder = this.sortorder || 10;
  this.atom = this.atom || 0;
  
  this.page = page;
  this.itemId = (page && page.item) ? page.item.id : 0;
  
  this.atomId = this.atom;
  this.getAtom(app);
}

module.exports = Content;

Content.prototype.getAtom = function(app) {
  this.atom = (this.atomId > 0) ? app.getAtom(this.atomId) : null;
};
Content.prototype.contentLength = function() {
  return (this.data) ? this.data.length : 0;
};


Content.prototype.renderText = function() {
  return this.data;
};
Content.prototype.renderForm = function() {
  
};
Content.prototype.renderImage = function() {
   if (this.atom) {
     return "<img src=''>";
   } else {
     return "<!-- missing atom -->";
   }
};

Content.prototype.renderFile = function() {
      
};


Content.prototype.render = function() {
  if (this.kind === "T") {
    this.renderText();
    
  } else if (this.kind === "M") {
    this.renderForm();
  }
};


Content.prototype.scrapeFrom = function(controller) {
  this.atomId = controller.getParam("atom", this.atomId);
  this.getAtom(controller.app);
  
  this.name = controller.getParam("name", "");
  this.data = controller.getParam("data", "");
  this.kind = controller.getParam("kind", "T");
  this.sortorder = controller.getParam("sortorder", 10);
};

Content.prototype.doDelete = function(controller, finish) {
  var self = this;
  
  controller.query("delete from content where id = ?", [self.id], function(err, result){
    if (err) { 
      console.log("Content.doDelete -> error deleting content, id = " + self.id + " of " + self.language + "/" + self.itemId);
      console.log(err); 
    } else {
      console.log("Content.doDelete -> deleted content, id = " + this.id + " of " + self.language + "/" + self.itemId);
    }
    if (typeof finish == "function") { finish(); }
  });
};


Content.prototype.doUpdate = function(controller, isNew, finish) {
  var self = this;
  var values = [self.itemId, self.language, self.sortorder, self.kind, self.atomId, self.name, self.data];
  
  // new or existing record?
  if (isNew) {
    console.log("Content.doUpdate -> insert content " + self.name);
    controller.query("insert into pages (title, link, active, keywords, description , updated, created, item, language) " +
                     "values (?, ?, ?, ?, ?, now(), now(), ?, ?)", values,
      function(err, result) {
        if (err) { 
          console.log("Content.doUpdate -> error inserting content: " + self.language + "/" + self.itemId);
          console.log(err); 
        } else {
          console.log("Content.doUpdate -> inserted content: " + self.language + "/" + self.itemId);
          self.created = self.updated = new Date();
          if (typeof finish == "function") { finish(); }
        }
    });
    
  } else {
    console.log("Content.doUpdate -> update content " + self.itemId + " - " + self.title);
    controller.query("update pages set title = ?, link = ?, active = ?, keywords = ?, description = ?, updated = now() " +
                     " where item = ? and language = ?", values,
        function(err) {
          if (err) { 
            console.log("Content.doUpdate -> error updating content: " + self.language + "/" + self.itemId);
            console.log(err); 
          } else {
            console.log("Content.doUpdate -> updated content: " + self.language + "/" + self.itemId);
            self.updated = new Date();
            if (typeof finish == "function") { finish(); }
          }
    });
  }

};

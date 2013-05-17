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
  
  this.getAtom(this.atom, app);
}

module.exports = Content;

Content.prototype.getAtom = function(atomId, app) {
  this.atomId = atomId;
  this.atom = (atomId > 0) ? app.getAtom(atomId) : null;
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
  this.item = controller.getParam("item", this.item);
  this.language = controller.getParam("language", this.language);
  this.name = controller.getParam("name", "");
  this.intro = controller.getParam("intro", "N");
  this.atom = controller.getParam("atom", "N");
    this.getAtom(this.atom, controller.app);
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
  var values = [self.item, self.language, self.sortorder, self.intro, self.kind , self.atom, self.nameId, self.data];
  
  // new or existing record?
  if (isNew) {
    console.log("Content.doUpdate -> insert content " + self.name);
    controller.query("insert into content (item, language, sortorder, intro, kind , atom, name, data) " +
                     "values (?, ?, ?, ?, ?, now(), now(), ?, ?)", values,
      function(err, result) {
        if (err) { 
          console.log("Content.doUpdate -> error inserting content: " + self.language + "/" + self.itemId);
          console.log(err); 
        } else {
          console.log("Content.doUpdate -> inserted content: " + self.language + "/" + self.itemId + "/" + self.id);
          if (typeof finish == "function") { finish(); }
        }
    });
    
  } else {
    console.log("Content.doUpdate -> update content " + self.itemId + " - " + self.title);
    controller.query("update content set item=?, language=?, sortorder=?, intro=?, kind=? , atom=?, name=?, data=? " +
                     " where id = ?", values,
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

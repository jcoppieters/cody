//
// Johan Coppieters - may 2013 - cody
//
//
console.log("loading " + module.id);

var cody = require("../index.js");


function Content(basis, app) {
  // copy from basis
  for (var a in basis) {
    if (basis.hasOwnProperty(a)) {
      this[a] = basis[a];
    }
  }
  this.intro = this.intro || "N";
  this.name = this.name || "";
  this.data = this.data || "";
  this.kind = this.kind || "T";
  this.sortorder = this.sortorder || 10;
  this.atom = this.atom || 0;

  this.getAtom(this.atom, app);
}

module.exports = Content;

Content.kindName = function(theKind) {
  return (theKind === "I") ? "Image" :
         (theKind === "T") ? "Text" :
         (theKind === "M") ? "Form" :
         (theKind === "P") ? "Params" :
         (theKind === "S") ? "String" :
         (theKind === "F") ? "File" :
         "Block";
};

Content.prototype.attachTo = function(obj, itemId, language) {
  this.page = obj;
  this.language = language;
  this.itemId = itemId;
}


Content.prototype.getAtom = function(atomId, app) {
  this.atomId = atomId;
  this.atom = (atomId > 0) ? app.getAtom(atomId) : null;
};
Content.prototype.contentLength = function() {
  return (this.data) ? this.data.length : 0;
};
Content.prototype.isIntro = function() {
  return (this.intro === "Y");
};



Content.prototype.renderText = function(controller) {
  return this.data;
};
Content.prototype.renderParams = function(controller) {
  // these values should already be in the current context
  return "<!-- page params " + content.data + " -->";
}
Content.prototype.renderForm = function(controller) {
  var elements = (this.atom) ? this.atom.getChildren() : [];
  var arr = [];
  for (var iE in elements) {
    arr.push(elements[iE].note);
  }
  var form = new cody.Meta();
  form.addList(arr);

  var formInfo = (this.atom && this.atom.note && (this.atom.note.length > 2)) ? JSON.parse(this.atom.note) : {};
  var X = form.html(this.language, formInfo);

  return X;
};
Content.prototype.renderImage = function(controller) {
   if (this.atom) {
     return "<img src='" + controller.context.dynamic + "/images/" + this.atom.id + "." + this.atom.extention + "'>";
   } else {
     return "<!-- missing atom for " + this.id + " -->";
   }
};
Content.prototype.renderFile = function(controller) {
  return "<a href='" + controller.context.dynamic + "/files/" + this.atom.id + "." + this.atom.extention + "'><img class='icon' src='" + controller.context.cstatic + "/extentions/" + this.atom.extention + ".png'/></a>" +
         "<a href='" + controller.context.dynamic + "/files/" + this.atom.id + "." + this.atom.extention + "' class='filelink'>" + this.atom.getFileName() + "</a>";
};


Content.prototype.render = function(controller) {
  if (this.kind === "T") {
    return this.renderText(controller);
    
  } else if (this.kind === "S") {
    return this.renderText(controller);
    
  } else if (this.kind === "M") {
    return this.renderForm(controller);
    
  } else if (this.kind === "I") {
    return this.renderImage(controller);

  } else if (this.kind === "F") {
    return this.renderFile(controller);

  } else if (this.kind === "P") {
    return this.renderParams(controller);

  } else {
    return controller.render(this);

  }
};


Content.prototype.scrapeFrom = function(controller) {
  this.name = controller.getParam("name", "");
  this.intro = controller.getParam("intro", "N");
  this.atom = controller.getParam("atom", "N");
    this.getAtom(this.atom, controller.app);
  this.data = controller.getParam("data", "");
  this.kind = controller.getParam("kind", "T");
  this.sortorder = controller.getParam("sortorder", 10);
};

Content.prototype.scrapeFromWithId = function(controller) {
  this.name = controller.getParam("name_"+this.id, this.name);
  this.intro = controller.getParam("intro_"+this.id, "N");
  this.atom = controller.getParam("atom_"+this.id, "N");
    this.getAtom(this.atom, controller.app);
  this.data = controller.getParam("data_"+this.id, "");
  this.kind = controller.getParam("kind_"+this.id, "T");
  this.sortorder = controller.getParam("sortorder_"+this.id, 10);
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
    if (typeof finish === "function") { finish(); }
  });
};


Content.prototype.doUpdate = function(controller, isNew, finish) {
  var self = this;
  var values = [self.itemId, self.language, self.sortorder, self.intro, self.kind , self.atomId, self.name, self.data];
  
  // new or existing record?
  if (isNew) {
    // console.log("Content.doUpdate -> insert content " + self.name);
    controller.query("insert into content (item, language, sortorder, intro, kind , atom, name, data) " +
                     "values (?, ?, ?, ?, ?, ?, ?, ?)", values,
      function(err, result) {
        if (err) { 
          console.log("Content.doUpdate -> error inserting content for: " + self.language + "/" + self.itemId);
          console.log(err); 
        } else {
          self.id = result.insertId;
          console.log("Content.doUpdate -> inserted content: " + self.id + ", order: " + self.sortorder + ", for: " + self.language + "/" + self.itemId);
          if (typeof finish === "function") { finish(); }
        }
    });
    
  } else {
    //console.log("Content.doUpdate -> update content: " + self.id + ", for: " + self.itemId + " - " + self.kind);
    values.push(this.id);
    controller.query("update content set item=?, language=?, sortorder=?, intro=?, kind=? , atom=?, name=?, data=? " +
                     " where id = ?", values,
        function(err) {
          if (err) { 
            console.log("Content.doUpdate -> error updating content: " + self.id + ", for: " + self.language + "/" + self.itemId);
            console.log(err); 
          } else {
            console.log("Content.doUpdate -> updated content: " + self.id + ", order: " + self.sortorder + ", for: " + self.language + "/" + self.itemId);
            self.updated = new Date();
            if (typeof finish === "function") { finish(); }
          }
    });
  }

};

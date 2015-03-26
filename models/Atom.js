//
// Johan Coppieters - jan 2013 - Cody
//
//
console.log("loading " + module.id);
var fs = require("fs");


//!! basis objects (passed to Atom constructor or created with addDefaults have a parent that is an integer)
//Objects created with the contructor Atom have a parent and parentId that are integers
//only after "pickParent" become the parent instance variable a real (Atom) object

function Atom(basis) {
  // copy from basis
  for (var a in basis) {
    if (basis.hasOwnProperty(a)) {
      this[a] = basis[a];
    }
  }
  this.parentId = this.parent;
  this.parent = undefined;
}
module.exports = Atom;


Atom.kDefaultName = "New item";

Atom.addDefaults = function(basis, parent) {
  if (typeof parent === "undefined") { parent = {}; }
  
  basis.name = basis.name || Atom.kDefaultName;
  basis.parent = basis.parent || parent.id;
  basis.note = basis.note || "";
  basis.extention = basis.extention || "";
  basis.sortorder = basis.sortorder || 9999;
  basis.created = basis.created || new Date();
  basis.updated = basis.updated || new Date();
  
  return basis;
};


Atom.prototype.pickParent = function(atomList) {
  this.parent = atomList[this.parentId];
};

Atom.loadAtoms = function(connection, store) {
  connection.query('select * from atoms', [], function(err, result) {
    store(result);
  });
};

/* required protocol for nodes: */

Atom.prototype.getAllowedGroups = function() { 
  return "*"; 
};
Atom.prototype.hasChildren = function() { 
  return this.app.hasAtomChildren(this); 
};
Atom.prototype.isActive = function() { 
  return true; 
};
Atom.prototype.isVisible = function() { 
  return true; 
};
Atom.prototype.getChildren = function() { 
  return this.app.getAtomChildren(this); 
};

Atom.prototype.getSortOrder = function() { 
  return this.sortorder; 
};
Atom.prototype.setSortOrder = function(nr) {
  this.sortorder = nr;
};

Atom.prototype.getNote = function() { 
  return this.note; 
};
Atom.prototype.setNote = function(note) { 
  this.note = note; 
};

Atom.prototype.setName = function(name) { 
  this.name = name; 
};
Atom.prototype.getName = function() { 
  return this.name; 
};

Atom.prototype.setExtention = function(extention) { 
  this.extention = extention.toLowerCase();
};
Atom.prototype.getExtention = function() { 
  return this.extention; 
};

Atom.prototype.getFileName = function() { 
  return this.id + "." + this.extention; 
};
Atom.prototype.getPathName = function(controller) {
    return controller.app.getDataPath() + controller.getFolder() + "/" + this.id + "." + this.extention;

};

Atom.prototype.getId = function() { 
  return this.id; 
};

/* Atom specific */

Atom.prototype.isChild = function(anAtom) {
  return anAtom.parentId == this.id;
};


Atom.prototype.scrapeFrom = function(controller) {
  // update all item info from the controller
  // JC: 26/03/2015 -- added default param "", otherwise extention would be undefined for forms
  //  and if the caller was a FormController, it would assume it was an form element, not a form itself.
  this.name = controller.getParam("name", "");
  this.extention = controller.getParam("extention", "");
  this.note = controller.getParam("note", "");
};


Atom.prototype.doUpdate = function(controller, finish) {
  var self = this;
  
  var values = [self.name, self.parentId, self.sortorder, self.note, self.extention];
  
  // new or existing record?
  if ((typeof self.id === "undefined") || (self.id === 0)) {
    
    console.log("Atom.doUpdate -> insert atom " + self.name);
    values.push(controller.getLoginId());
    controller.query("insert into atoms (name, parent, sortorder, note, extention, updated, created) " +
                     "values (?, ?, ?, ?, ?, now(), now())", values,
      function(err, result) {
        if (err) { 
          console.log("Atom.doUpdate -> erroring inserting atom: " + self.name);
          console.log(err); 
        } else {
          self.id = result.insertId;
          console.log("Atom.doUpdate -> inserted atom: " + self.id);
          if (typeof finish === "function") { finish(); }
        }
    });
    
  } else {
    console.log("Atom.doUpdate -> update atom " + self.id + " - " + self.name);
    values.push(self.id);
    controller.query("update atoms set name = ?, parent = ?, sortorder = ?, note = ?, extention = ?, updated = now() " +
                     "where id = ?", values,
      function(err) {
        if (err) { 
          console.log("Atom.doUpdate -> erroring updating atom: " + self.id);
          console.log(err); 
        } else {
          console.log("Atom.doUpdate -> updated atom: " + self.id);
          if (typeof finish === "function") { finish(); }
        }
    });
  }
};

Atom.prototype.doDelete = function(controller, finish) {
  var self = this;
  console.log("Atom.doDelete -> delete atom " + self.id + " - " + self.name);
  controller.query("delete from atoms where id = ?", [ self.id ], function() {
    delete controller.app.atoms[self.id];
    console.log("Atom.doUpdate -> deleted atom: " + self.id);
    
    if ((self.extention === "---") || (self.extention === "xxx") || (self.extention === "")) {       
      console.log("Atom.doDelete -> no file attached");
      if (typeof finish === "function") { finish(); }
      
    } else {
      fs.unlink(self.getPathName(controller), function(err) {
        console.log("Atom.doDelete -> file deleted (" + err + ")");
        if (typeof finish === "function") { finish(err); }
      });
    }
 });
};


//
// Johan Coppieters - jan 2013 - jWorks
//
//
console.log("loading " + module.id);
var cody = require('./../index.js');


//!! basis objects (passed to Item constructor or created with addDefaults have a parent that is an integer)
//Objects created with the contructor Item have a parent and parentId that are integers
//only after "pickParent" become the parent instance variable a real (Item) object

function Item(basis, app) {
  // copy from basis
  for (var a in basis) {
    if (basis.hasOwnProperty(a)) {
      this[a] = basis[a];
    }
  }
  
  // replace 'template' by the real object and add 'templateId'
  this.templateId = this.template;
  this.template = app.getTemplate(this.templateId);
  if (typeof this.template === "undefined") {
    app.err("Item.constructor", "did not find a template with id = " + this.templateId + " for item " + this.id + " / " + this.name);
  }
  
  // add a 'parentId' for consistency
  //  this.parent will be replaced once all items are created in 'pickParent'
  this.parentId = this.parent;
}

module.exports = Item;


  
Item.addDefaults = function(basis, parent) {
  if (typeof parent === "undefined") { parent = {}; }
  
  basis.name = basis.name || Item.kDefaultName;
  basis.parent = basis.parent || parent.id;
  basis.user = basis.user || parent.user;
  basis.sortorder = basis.sortorder || 9999;
  basis.orderby = basis.orderby || parent.orderby;
  basis.dated = basis.dated || new Date();
  basis.validfrom = basis.validfrom || new Date();
  basis.validto = basis.validto || cody.Application.endOfTime();
  basis.template = basis.template || parent.template.defaultchild;
  basis.showcontent = basis.showcontent || Item.kContent;
  basis.needslogin = basis.needslogin || parent.needslogin;
  basis.defaultrequest = basis.defaultrequest || "list";
  basis.alloweddomains = basis.alloweddomains || parent.alloweddomains;
  
  return basis;
};

Item.orderbyList = [ { id: 'M', name: 'Manual'},
                     { id: 'A', name: 'Alphabetical'},
                     { id: 'D', name: 'Chronological'} ];
Item.showcontentList = [ { id: 'Y', name: 'Content'},
                         { id: 'S', name: 'First subitem'},
                         { id: 'N', name: 'All subitems'},
                         { id: 'D', name: 'Don\'t show subitems'},
                         { id: 'L', name: 'Lightbox (not yet implemented)'} ];


Item.prototype.pickParent = function(itemList) {
  this.parent = itemList[this.parentId];
};

Item.loadItems = function(connection, store) {
  connection.query('select * from items', [], function(err, result) {
    if (err) { console.log(err); throw(new Error("Item.loadItems failed with sql errors")); }
    store(result);
  });
};

// values for orderby
Item.kManual        = 'M';
Item.kAlphabetical  = 'A';
Item.kDate          = 'D';

// values for showcontent
Item.kContent     = 'Y';
Item.kNothing     = 'N';
Item.kSubItem     = 'S';
Item.kNoSubitems  = 'D';
Item.kLightBox    = 'L';

Item.kDefaultName  = 'New item';


Item.prototype.getId = function() {
  return this.id;
};
Item.prototype.getAllowedDomains = function() {
  return this.alloweddomains;
};

Item.prototype.needsLogin = function() {
  return (this.needslogin) && (this.needslogin === "Y");
};

Item.prototype.setTemplate = function(templateId, controller) {
  this.templateId = templateId;
  if (typeof controller !== "undefined") {
    this.template = controller.app.getTemplate(templateId);
    if (typeof this.template === "undefined") {
      controller.feedBack("Couldn't find the template with id = " + templateId + " for item " + this.id + " / " + this.name);
    }
  }
};


Item.prototype.scrapeFrom = function(controller) {
  // update all item info from the controller
  this.dated = controller.getDate("dated");
  this.validfrom = controller.getDate("validfrom");
  this.validto = controller.getDate("validto");
  this.needslogin = controller.getParam("needslogin");
  this.showcontent = controller.getParam("showcontent");
  this.alloweddomains = controller.getParam("alloweddomains");
  this.setTemplate(controller.getParam("template"), controller);      
  this.orderby = controller.getParam("orderby");
  this.defaultrequest = controller.getParam("defaultrequest", this.defaultrequest || "list");
  // user is only filled at creation time
};


Item.prototype.doUpdate = function(controller, finish) {
  var self = this;
  
  var values = [self.name, self.parentId, self.user, self.templateId, self.orderby, self.sortorder, 
                self.dated, self.validfrom, self.validto, self.showcontent, self.needslogin,
                self.defaultrequest, self.alloweddomains];
  
  // new or existing record?
  if ((typeof self.id === "undefined") || (self.id === 0)) {
    
    //console.log("Item.doUpdate -> insert item " + self.name);
    controller.query("insert into items (name, parent, user, template, orderby, sortorder, " +
                     " dated, validfrom, validto, showcontent, needslogin, " +
                     " defaultrequest, alloweddomains) " +
                     "values (?, ?, ?, ?, ?, ?,  ?, ?, ?, ?, ?,  ?, ?)", values,
      function(err, result) {
        if (err) { 
          console.log("Item.doUpdate -> erroring inserting item: " + self.name);
          console.log(err); 
        } else {
          self.id = result.insertId;
          console.log("Item.doUpdate -> inserted item: " + self.id);
          if (typeof finish === "function") { finish(); }
        }
    });
    
  } else {
    //console.log("Item.doUpdate -> update item " + self.id + " - " + self.name);
    values.push(self.id);
    controller.query("update items set name = ?, parent = ?, user = ?, template = ?, orderby = ?, sortorder = ?, " +
                     " dated = ?, validfrom = ?, validto = ?, showcontent = ?, needslogin = ?, " +
                     " defaultrequest = ?, alloweddomains = ? " +
                     "where id = ?", values,
      function(err) {
        if (err) { 
          console.log("Item.doUpdate -> erroring updating item: " + self.id);
          console.log(err); 
        } else {
          console.log("Item.doUpdate -> updated item: " + self.id);
          if (typeof finish === "function") { finish(); }
        }
    });
  }
};

Item.prototype.doDelete = function(controller, finish) {
  var self = this;

  controller.query("delete from items where id = ?", [ self.id ], function() {
    delete controller.app.items[self.id];
    console.log("Item.doDelete -> deleted item: " + self.id);
    
    controller.query("delete from pages where item = ?", [ self.id ], function(err) {
      if (err) { 
        console.log("Item.doDelete -> erroring deleting all pages from item: " + self.id);
        console.log(err); 
      } else {
        controller.app.deletePagesForItem(self.id, function() {
          console.log("Item.doDelete -> deleted all pages from item: " + self.id);
          
          controller.query("delete from content where item=?", [ self.id ], function(err) {
            if (err) { 
              console.log(err); 
            } else {
              console.log("Item.doDelete -> deleted all content of item: " + self.id);
              if (typeof finish === "function") { finish(); }
            }
          });
        });
      }
    });
  });
};


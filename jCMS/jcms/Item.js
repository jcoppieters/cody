//
// Johan Coppieters - jan 2013 - jWorks
//
//
console.log("loading " + module.id);
var jcms = require('./index.js');

module.exports = Item;

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
  if (typeof this.template == "undefined") {
    app.err("Item.constructor", "did not find a template with id = " + this.templateId + " for item " + this.id + " / " + this.name);
  }
  
  // add a 'parentId' for consistency
  //  this.parent will be replaced once all items are created in 'pickParent'
  this.parentId = this.parent;
  
  // add a 'formId' for consistency
  this.formId = this.form;
  this.form = app.getForm(this.formId);
  if (typeof this.form == "undefined") {
    app.err("Item.constructor", "did not find a form with id = " + this.formId + " for item " + this.id + " / " + this.name);
  }
}
  
Item.addDefaults = function(basis, parent) {
  if (typeof parent == "undefined") { parent = {}; }
  
  basis.name = basis.name || Item.kDefaultName;
  basis.parent = basis.parent || parent.id;
  basis.user = basis.user || parent.user;
  basis.sortorder = basis.sortorder || 9999;
  basis.orderby = basis.orderby || parent.orderby;
  basis.dated = basis.dated || new Date();
  basis.validfrom = basis.validfrom || new Date();
  basis.validto = basis.validto || jcms.Application.endOfTime();
  basis.active = basis.active || "Y";
  basis.template = basis.template || parent.template.defaultchild;
  basis.showcontent = basis.showcontent || Item.kContent;
  basis.allowdelete = basis.allowdelete || parent.allowdelete;
  basis.allowinsert = basis.allowinsert || parent.allowinsert;
  basis.needslogin = basis.needslogin || parent.needslogin;
  basis.defaultoper = basis.defaultoper || "list";
  basis.form = basis.form || parent.formId;
  basis.allowedgroups = basis.allowedgroups || parent.allowedgroups;
  
  return basis;
};


Item.prototype.pickParent = function(itemList) {
  this.parent = itemList[this.parentId];
};

Item.loadItems = function(connection, store) {
  connection.query('select * from items', [], function(err, result) {
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

Item.kDefaultName  = 'New Page';


Item.prototype.getAllowedGroups = function() {
  return this.allowedgroups;
};

Item.prototype.needsLogin = function() {
  return (this.needslogin) && (this.needslogin === "Y");
};

Item.prototype.setTemplate = function(templateId, controller) {
  this.templateId = templateId;
  if (typeof controller != "undefined") {
    this.template = controller.app.getTemplate(templateId);
    if (typeof this.template == "undefined") {
      controller.feedback("Couldn't find the template with id = " + templateId + " for item " + this.id + " / " + this.name);
    }
  }
};
Item.prototype.setForm = function(formId, controller) {
  this.formId = formId;
  if (typeof controller != "undefined") {
    this.form = controller.app.getForm(formId);
    if (typeof this.form == "undefined") {
      controller.feedback("Couldn't find the form with id = " + formId + " for item " + this.id + " / " + this.name);
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
  this.allowedgroups = controller.getParam("allowedgroups");
  this.setTemplate(controller.getParam("template"), controller);      
  this.setForm(controller.getParam("form"), controller);
  this.orderby = controller.getParam("orderby");
  
  // missing: user (at create time), allowdelete, allowinsert, defaultoper (??)
};


Item.prototype.doUpdate = function(controller, finish) {
  var self = this;
  
  var values = [self.name, self.parentId, self.user, self.templateId, self.orderby, self.sortorder, self.dated,
                 self.validfrom, self.validto, self.active, self.showcontent, self.allowdelete, self.allowinsert, self.needslogin,
                self.defaultoper, self.formId, self.allowedgroups];
  
  // new or existing record?
  if ((typeof self.id == "undefined") || (self.id === 0)) {
    
    console.log("Item.doUpdate -> insert item " + self.name);
    controller.query("insert into items (name, parent, user, template, orderby, sortorder, " +
                     " dated, validfrom, validto, active, showcontent, allowdelete, allowinsert, needslogin, " +
                     " defaultoper, form, allowedgroups) " +
                     "values (?, ?, ?, ?, ?, ?,  ?, ?, ?, ?, ?, ?, ?, ?,  ?, ?, ?)", values,
      function(err, result) {
        if (err) { 
          console.log("Item.doUpdate -> erroring inserting item: " + self.name);
          console.log(err); 
        } else {
          self.id = result.insertId;
          console.log("Item.doUpdate -> inserted item: " + self.id);
          if (typeof finish == "function") { finish.call(self, controller); }
        }
    });
    
  } else {
    console.log("Item.doUpdate -> update item " + self.id + " - " + self.name);
    values.push(self.id);
    controller.query("update items set name = ?, parent = ?, user = ?, template = ?, orderby = ?, sortorder = ?, " +
                     " dated = ?, validfrom = ?, validto = ?, active = ?, showcontent = ?, allowdelete = ?, allowinsert = ?, needslogin = ?, " +
                     " defaultoper = ?, form = ?, allowedgroups = ? " +
                     "where id = ?", values,
      function(err) {
        if (err) { 
          console.log("Item.doUpdate -> erroring updating item: " + self.id);
          console.log(err); 
        } else {
          console.log("Item.doUpdate -> updated item: " + self.id);
          if (typeof finish == "function") { finish.call(self, controller); }
        }
    });
  }
};

Item.prototype.doDelete = function(controller, finish) {
  var self = this;
  console.log("Item.doDelete -> delete item " + self.id + " - " + self.name);
  controller.query("delete from items where id = ?", [ self.id ], function() {
    delete controller.app.items[self.id];
    console.log("Item.doUpdate -> deleted item: " + self.id);
    
    controller.query("delete from pages where item = ?", [ self.id ], function(err) {

      if (err) { 
        console.log("Item.doDelete -> erroring deleting all pages from item: " + self.id);
        console.log(err); 
      } else {
        controller.app.deletePagesForItem(self.id, function() {
          console.log("Item.doDelete -> deleted all pages from item: " + self.id);
          if (typeof finish == "function") { finish.call(self, controller); }
        });
      }
    });
  });
};


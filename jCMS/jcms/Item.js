//
// Johan Coppieters - jan 2013 - jWorks
//
//
console.log("loading " + module.id);

module.exports = Item;

function Item(basis, app) {
  // copy from basis
  for (var a in basis) {
    if (basis.hasOwnProperty(a))
      this[a] = basis[a];
  }
  
  // replace 'template' by the real object and add 'templateId'
  this.templateId = this.template;
  this.template = app.getTemplate(this.templateId);
  if (this.template == undefined)
    app.err("Item.constructor", "did not find a template for item " + this.id + " / " + this.name);
      
  // add a 'parentId' for consistency
  //  this.parent will be replaced once all items are created in 'pickParent'
  this.parentId = this.parent;
}

Item.prototype.pickParent = function(itemList) {
  this.parent = itemList[this.parentId];
}

// values for orderby
Item.kManual		= 'M';
Item.kAlphabetical	= 'A';
Item.kDate			= 'D';

// values for showcontent
Item.kContent		= 'Y';
Item.kNothing		= 'N';
Item.kSubItem 		= 'S';
Item.kNoSubitems	= 'D';
Item.kLightBox		= 'L';

Item.kDefaultName	= 'New Item';


Item.prototype.getAllowedGroups = function() {
	return this.allowedgroups;
};

Item.prototype.update = function(controller, finish) {
  console.log("Item - update: ", this.id + " / " + this.name);
  finish();
}

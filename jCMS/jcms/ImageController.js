//
// Johan Coppieters - jan 2013 - jWorks
//
//
var mysql = require('mysql');
var jcms = require('./index.js');

console.log("loading " + module.id);


function ImageController(context) {
  console.log("ImageController.constructor -> page: (" + context.page.itemId + ") " + context.page.title);
  
  // init inherited controller
  jcms.TreeController.call(this, context);
}
module.exports = ImageController;

ImageController.prototype = new jcms.TreeController();


ImageController.prototype.doRequest = function( finish ) {
  var self = this;
  
  self.context.fn = "admin/images.ejs";
  jcms.TreeController.prototype.doRequest.call(self, finish);
 
};

ImageController.prototype.getRoot = function() {
  return this.app.getAtom(1);
};

ImageController.prototype.getType = function(theNode) { 
  return "image"; 
};

ImageController.prototype.getFilePath = function() { 
  return "/images"; 
};
ImageController.prototype.getObject = function(id) {
  return this.app.getAtom(id);
};


/* Overridden - Action functions */

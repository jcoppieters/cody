//
// Johan Coppieters - jan 2013 - jWorks
//
//
var mysql = require('mysql');
var jcms = require('./index.js');

console.log("loading " + module.id);


function ImageController(context) {
  // only called for using my methods
  if (context === undefined) { return; }
  console.log("ImageController.constructor -> page(" + context.page.itemId + ") = " + context.page.title + ", request = " + context.request);
  
  // init inherited controller
  jcms.TreeController.call(this, context);
  
}
ImageController.prototype = new jcms.TreeController();


module.exports = ImageController;



ImageController.prototype.doRequest = function( finish ) {
  var self = this;
  
  self.context.fn = "admin/images.ejs";
  
  if (self.context.request == "imagelist") {
    self.getImageList();
    finish("");

  } else {
    jcms.TreeController.prototype.doRequest.call(self, finish);
    
  }
};

ImageController.prototype.getRoot = function() {
  return this.app.getAtom( jcms.Application.kImageRoot );
};

ImageController.prototype.getType = function(theNode) { 
  return ((theNode.extention === "xxx") || (theNode.extention === "")) ? "folder" : "image"; 
};

ImageController.prototype.getFilePath = function() { 
  return this.context.dynamic + "/images"; 
};
ImageController.prototype.getObject = function(id) {
  return this.app.getAtom(id);
};


/* Overridden - Action functions */


/* specific functions */
ImageController.prototype.getImageList = function() {
  console.log("Received ImageController - getImageList");

  this.gen("var tinyMCEImageList = " + this.getArray( this.app.getAtom(1) ) + ";", 
           {"Content-type": "application/javascript"}); 
  //TODO: add headers:  "pragma": "no-cache", "expires": "0" ?
};



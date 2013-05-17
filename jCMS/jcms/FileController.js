//
// Johan Coppieters - jan 2013 - jWorks
//
//
var mysql = require('mysql');
var jcms = require('./index.js');

console.log("loading " + module.id);


function FileController(context) {
  // only called for using my methods
  if (context === undefined) { return; }
  console.log("FileController.constructor -> page(" + context.page.itemId + ") = " + context.page.title + ", request = " + context.request);
  
  // init inherited controller
  jcms.TreeController.call(this, context);
  
}

FileController.prototype = Object.create( jcms.TreeController.prototype );
module.exports = FileController;



FileController.prototype.doRequest = function( finish ) {
  var self = this;
  
  self.context.fn = "cms/files.ejs";
  
  if (self.context.request == "xxx") {
    // needed ?
    finish("");

  } else {
    jcms.TreeController.prototype.doRequest.call(self, finish);
    
  }
};


FileController.prototype.getRoot = function() {
  return jcms.Application.kFileRoot;
};
FileController.prototype.getType = function(theNode) { 
  return ((theNode.extention === "xxx") || (theNode.extention === "")) ? "folder" : "file"; 
};
FileController.prototype.getObject = function(id) {
  return this.app.getAtom(id);
};
FileController.prototype.getFolder = function() { 
  return "/files"; 
};


/* Overridden - Action functions */



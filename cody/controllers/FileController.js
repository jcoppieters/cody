//
// Johan Coppieters - jan 2013 - jWorks
//
//
var mysql = require('mysql');
var cody = require('../index.js');

console.log("loading " + module.id);


function FileController(context) {
  console.log("FileController.constructor -> page(" + context.page.itemId + ") = " + context.page.title + ", request = " + context.request);
  
  // init inherited controller
  cody.TreeController.call(this, context);
  
}

FileController.prototype = Object.create( cody.TreeController.prototype );
module.exports = FileController;



FileController.prototype.doRequest = function( finish ) {
  var self = this;
  
  if (self.isRequest("xxx")) {
    // needed ?
    finish("");

  } else {
    cody.TreeController.prototype.doRequest.call(self, finish);
    
  }
};


FileController.prototype.getRoot = function() {
  return cody.Application.kFileRoot;
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



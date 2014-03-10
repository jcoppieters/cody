//
// Johan Coppieters - feb 2014 - bok
//
//
console.log("loading " + module.id);

var mysql = require("mysql");
var cody = require("../../cody/index.js");


function MemberController(context) {
  console.log("MemberController.constructor -> page(" + context.page.itemId + ") = " + context.page.title + ", request = " + context.request);
  
	// init inherited controller
	cody.Controller.call(this, context);
}

MemberController.prototype = Object.create( cody.Controller.prototype );
module.exports = MemberController;



MemberController.prototype.doRequest = function( finish ) {
  var self = this;

  console.log("doRequest");

  if (this.isRequest("Save") || this.isRequest("Bewaar")) {
    self.doSave( finish );

  }  else {
    self.doList( finish );
  }
};


	
MemberController.prototype.doSave = function( finish ) {
  var self = this;
  var params = [];
  params.push( this.getParam("id", 0) );

  self.query("update users set name = name where id = ?", params, function() {
     self.feedBack(true, "Successfully saved the data");
     self.doList( finish );
  });
};


MemberController.prototype.doList = function(finish) {
  var self = this;
console.log("dolist");
  this.query("select * from users order by name ", [], function(err, result) {
    console.log("results: " + result);
    self.context.members = result;
    finish();
  });
};


/*

alter table users add since varchar(4) default '';
alter table users add phone1 varchar(32) default '';
alter table users add phone2 varchar(32) default '';
alter table users add partner varchar(128) default '';
alter table users add children varchar(512) default '';
alter table users add born date;
alter table users add address varchar(256) default '';

 */
//
// Johan Coppieters - mar 2014 - jsconf
//
//
console.log("loading " + module.id);

var mysql = require("mysql");
var cody = require("../../cody/index.js");

/*
create table wall(
 id int(11) not null unique key auto_increment,
 at datetime,
 note varchar(1024),
 kind char(1) default 'R'
);

 */
function WallController(context) {

	// init inherited controller
	cody.Controller.call(this, context);
}

// get us a prototype object
WallController.prototype = Object.create( cody.Controller.prototype );

// export our constructor
module.exports = WallController;


// we get this function whenever Cody thinks we're responsible for handling the http request
WallController.prototype.doRequest = function( finish ) {
  var self = this;

  if (self.isRequest("delete")) {
    self.query("delete from wall where id = ?", [this.getParam("id", 0)], function(err, result) {
      if (err) self.feedBack(false, err);
      self.getList(finish);
    });

  } else if ((self.isRequest("Ask")) || (self.isRequest("Remark"))) {
    // get our 2 main parameters
    console.log("request" + self.context.request);
    var kind = (this.isRequest("Ask")) ? "Q" : "R";
    var note = this.getParam("note", "");

    self.query("insert into wall (at, note, kind) values (now(), ?, ?)", [note, kind], function(err, result) {
      if (err) self.feedBack(false, err);
      self.getList(finish);
    });

  } else {
    self.getList(finish);

  }
};


WallController.prototype.getList = function( finish ) {
  var self = this;

  self.query("select id, note, at, kind from wall order by at desc limit 20", [], function(err, results) {
    if (err) self.feedBack(false, err);
    console.log("got " + results.length + " results");
    self.context.wallList = results;
    finish();
  });
};

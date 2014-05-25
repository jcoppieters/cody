//
// Johan Coppieters - apr 2014 - website StefDekien started from jsconf.be
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
function NewsController(context) {
  console.log("Stef - NewsController");
	// init inherited controller
	cody.Controller.call(this, context);
}

// get us a prototype object
NewsController.prototype = Object.create( cody.Controller.prototype );

// export our constructor
module.exports = NewsController;


// we get this function whenever Cody thinks we're responsible for handling the http request
NewsController.prototype.doRequest = function( finish ) {
  var self = this;
  var topic = self.context.page.link;

  if (self.isRequest("thanks")) {
    self.feedBack(true, "Dank je.<br>Je reactie (en email adres) is enkel zichtbaar voor Katrien.");
    self.getList(finish);

  } else if (self.isRequest("delete")) {
    self.query("delete from wall where id = ?", [this.getParam("id", 0)], function(err, result) {
      self.nextRequest(err, "list", finish);
    });

  } else if ((self.isRequest("Vertel")) || (self.isRequest("Reactie"))) {
    // get our 2 main parameters   +   Q = vertel or question -- R = reaction
    var kind = (this.isRequest("Vertel")) ? "Q" : "R";
    var note = this.getParam("note", "");
    var email = this.getParam("email", "");

    self.query("insert into wall (at, note, kind, topic, email) values (now(), ?, ?, ?, ?)", [note, kind, topic, email], function(err, result) {
       self.nextRequest(err, (kind === "R") ? "thanks" : "list", finish);
    });

  } else {
    self.getList(finish);

  }
};


NewsController.prototype.getList = function( finish ) {
  var self = this;

  // var kind = (self.getLoginLevel() > 0) ? "'Q','R'" : "'Q'";

  self.query("select id, note, at, kind, email from wall where topic = ? order by at desc limit 3000", [self.context.page.link], function(err, results) {
    if (err) self.feedBack(false, err);
    console.log("got " + results.length + " Wall results");
    self.context.wallList = results;
    console.log("message: " + self.context.message);
    finish();
  });
};

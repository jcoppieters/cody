//
// Johan Coppieters - first integration into cody code base 29/03/2015
//
// alpha 1: uses Model, CRUD operations are working
// planned:
//  - alpha 2: dynamic tags, add tag
//  - alpha 3: send mail
//  - alpha 4: copy from data.data (JSON) -> contacts, JSON.rest -> contacts.data
// beta 1: add template to "empty"
//
//

console.log("loading " + module.id);

var cody = require("cody/index.js");


function ContactController(context) {
  console.log("ContactController.constructor -> page(" + context.page.itemId + ") = " + context.page.title + ", request = " + context.request);

  // make a contact model and attach to controller
  var myModel = new cody.Model(this, {
    tableName: "contacts",
    id: {name: "id", def: 0},
    cols: [
      {name: "name",   label: "Name",        def: "",  list: true, sort: "asc", q: "like"},
      {name: "cie",    label: "Company",     def: "",  list: true, q: "like" },
      {name: "title",  label: "Title",       def: "",  list: false},
      {name: "tags",   label: "Tags",        def: "",  list: false, q: "like"},
      {name: "email",  label: "Email",       def: "",  list: true},
      {name: "data",   label: "JSON Data",   def: "{}",  list: false},
      {name: "phone",  label: "Phone",       def: "",  list: true},
      {name: "origin", label: "Origin",      def: "",  list: false},
      {name: "active", label: "Active",      def: "Y", list: true, hide: true},
      {name: "data",   label: "Name",        def: "Y", list: false},
      {name: "nomail", label: "Allows Mail", def: "Y", list: true, hide: true}]
  });

  this.model.addRef("tags", "select id, name from tags order by name");

  context.model = myModel;

	// init inherited controller
	cody.Controller.call(this, context);
}

ContactController.prototype = Object.create( cody.Controller.prototype );
module.exports = ContactController;



ContactController.prototype.doRequest = function( finish ) {
  var self = this;

  if (this.doCrudRequest(finish)) {
    // handled by std controller

  } else if (this.isRequest("mail")) {
    self.doMails(finish);

  } else {
    cody.Controller.prototype.doRequest.call(self, finish);

  }
};

ContactController.prototype.doMails = function (finished) {
  this.sendTargetMails(finished, this.getParam("q.tags", ""),
    this.app.mailFrom, this.getParam("subject", "testing"),
    this.getParam("body","cody-cms.org testing"));
}


ContactController.prototype.sendTargetMails = function (finished, tags, pFrom, pSubject, pText) {
  var self = this;

  var p = "";
  var ps = [];
  if (Array.isArray(tags)) {
    for(var it in tags) {
      p = p + ((it == 0) ? "where " : " or ") + "tags like ?";
      ps.push("%"+tags[it]+"%");
    }
  }
  console.log("Sending email from " + pFrom + " to contacts with tags: " + tags + " -> " + p);

  self.query("select * from contacts " + p, ps, function(err, result) {
    if (err) { console.log("error selecting contacts with tags "+ tags + " -> " + err); } else {

      for (var iC in result) {
        var C = result[iC];
        //self.sendMail (pFrom, C.email, pSubject, pText);
        console.log ("mailto: " + pFrom + " - " + C.email + " - " +  pSubject + " - " +  pText);

      }
    }
  });

};
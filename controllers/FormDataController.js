//
// Johan Coppieters - sept 2013 - cody
//
//
console.log("loading " + module.id);

var cody = require("../index.js");


function FormDataController(context) {

  // init inherited controller and add all instance variables
  cody.Controller.call(this, context);
}

FormDataController.prototype = Object.create( cody.Controller.prototype );
module.exports = FormDataController;



FormDataController.prototype.doRequest = function( finish ) {
  var self = this;
  if (self.isRequest("")) { self.setRequest("list"); }

  var id = this.getParam("id", 0);
  var meta = this.getParam("meta", 0);

  console.log("FormDataController.constructor -> id = " + id + ", meta = " + meta + ", request = " + self.context.request);


  if (self.isRequest("save")) {
    self.saveData(id, meta, function() {
      self.context.fn = "-/cms/forms-list.ejs";
      self.listData(finish);
    });

  } else if (self.isRequest("delete")) {
      self.deleteData(id, function() {
        self.context.fn = "-/cms/forms-list.ejs";
        self.listData(finish);
      });

  } else if (self.isRequest("list")) {
    self.context.fn = "-/cms/forms-list.ejs";
    self.listData(finish);

  } else if (this.isRequest("edit")) {
    self.context.fn = "-/cms/forms-data.ejs";
    self.editData(meta, id, finish);

  } else if (this.isRequest("sendmail")) {
    self.context.fn = "-/cms/forms-list.ejs";
    self.sendAllMail(finish);

  } else if (this.isRequest("testmail")) {
    self.context.fn = "-/cms/forms-list.ejs";
    self.sendTestMail(finish);

  } else {
    cody.Controller.prototype.doRequest.call(self, finish);
  }

};

FormDataController.prototype.getDetailData = function() {
  var self = this;

  // current status and form id
  self.context.form_show = self.updateSession("form_show", "N");
  self.context.form_meta = self.updateSession("form_meta", 0);

  // get mail data
  self.context.subject = this.updateSession("subject", "");
  self.context.content = this.updateSession("content", "");
  self.context.testmail = this.updateSession("testmail", "");
  self.context.testname = this.updateSession("testname", "");
};


FormDataController.prototype.personalize = function(text, params) {
  // write generic replace... who???
  if (typeof params.Name != "undefined")
    text = text.replace("[name]", params.Name).replace("[Name]", params.Name);
  if (typeof params.name != "undefined")
    text = text.replace("[name]", params.name).replace("[Name]", params.name);

  return text;
}

FormDataController.prototype.sendAllMail = function(finish) {
  var self = this;
  var nr = 0;

  // fetch list & detail data
  self.listData(function() {
    // loop over self.content.data and send mails...
    cody.Application.each(self.context.data,
      function(done) {
        var body = self.personalize(self.context.content, this.data);

        // allow "email", "Email", "Mail" or "mail" in the formdata.
        var email =
          (typeof this.data.Email != "undefined") ? this.data.Email :
          (typeof this.data.email != "undefined") ? this.data.email :
          (typeof this.data.Mail  != "undefined") ? this.data.Mail :
          (typeof this.data.mail  != "undefined") ? this.data.mail : "";

        if (email !== "") {
          self.sendMail(self.app.mailFrom, email,
                        self.context.subject, body, function() {
            nr++;
            done();
          });
        } else {
          done();
        }
      },
      function(err) {
        if (err) console.log("something went wrong: " + err);
        console.log("Sent " + nr + " mails");
        self.feedBack(true, "Sent " + nr + " mails");
        finish();
      });
  });
};

FormDataController.prototype.sendTestMail = function(finish) {
  var self = this;

  // fetch list & detail data
  self.listData(function() {

    var body = self.personalize(self.context.content, {name: self.context.testname});
    self.sendMail(self.app.mailFrom, self.context.testmail, self.context.subject, body);

    finish();
  });
};



FormDataController.prototype.listData = function(finish) {
  var self = this;

  // allow users to come back to the list view and still see the same
  self.getDetailData();

  console.log("FormDataController.listData ->  meta = " + self.context.form_meta + ", status = " + self.context.form_show);

  self.query("select id, atom, data,status,created, modified from data " +
    "where (atom = ? or ? = 0) and (status = ? or ? = 'X') order by atom, created desc",
    [self.context.form_meta, self.context.form_meta, self.context.form_show, self.context.form_show], function(error, result) {
      if (error) { console.log("FormDataController.listData -> error " + error); }
      self.context.data = [];
      for (var i = 0; i < result.length; i++) {
        self.context.data[i] = cody.Meta.getData(result[i]);
      }
      finish();
    });
};


FormDataController.prototype.saveData = function(id, meta, finish) {
  var self = this;

  var atom = self.app.getAtom(meta);
  var meta = cody.FormController.makeMeta(atom);
  meta.objectId = self.getParam("id", 0);
  meta.readValuesFrom(self.context.params, false);
  meta.saveValues(self, self.getParam("status", "N"), finish);
};

FormDataController.prototype.deleteData = function(id, finish) {
  var self = this;

  self.query("delete from data where id = ?", [id], function(error, result) {
    if (error) {
      console.log("FormDataController.deleteData -> error " + error);
      self.feedBack(false, "Error deleting data [" + error + "]");
    }
    finish();

  });
};


FormDataController.prototype.editData = function(meta, id, finish) {
  var self = this;

  var atom = self.app.getAtom(meta);
  var meta = cody.FormController.makeMeta(atom);
  meta.readValues(self, id, function(error, data) {
    if (error) {
      console.log("FormDataController.editData -> error " + error);
      self.gen("NOK,Can not read the data from the database", { "Content-Type": "application/html" });
      return;
    } console.log(data);
    self.context.meta = meta;
    self.context.data = data;

    finish();
  });

};
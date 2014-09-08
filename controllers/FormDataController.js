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

  } else {
    cody.Controller.prototype.doRequest.call(self, finish);
  }

};


FormDataController.prototype.listData = function(finish) {
  var self = this;

  // allow users to come back to the list view and still see the same
  var status = this.getParam("form_show", this.fromSession("form_show", "N"));
  this.toSession("form_show", status);
  self.context.form_show = status;

  var meta = this.getParam("form_meta", this.fromSession("form_meta", 0));
  this.toSession("form_meta", meta);

  console.log("FormDataController.listData ->  meta = " + meta + ", status = " + status);

  self.query("select id, atom, data,status,created, modified from data " +
    "where (atom = ? or ? = 0) and (status = ? or ? = 'X') order by atom, created desc",
    [meta, meta, status, status], function(error, result) {
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
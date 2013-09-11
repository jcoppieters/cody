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

  console.log("FormDataController.constructor -> id = " + id + ", meta = " + meta + ", status = " + status + ", request = " + context.request);


  if (self.isRequest("save")) {
    self.saveData(id, meta, function() {
      self.context.fn = "-/forms-list.ejs";
      self.listData(finish);
    });

  } else if (self.isRequest("list")) {
    self.context.fn = "-/forms-list.ejs";
    self.listData(finish);

  } else if (this.isRequest("edit")) {
    self.context.fn = "-/forms-data.ejs";
    self.editData(id, finish);

  } else {
    cody.Controller.prototype.doRequest.call(self, finish);

  }

};


FormDataController.prototype.listData = function(meta, status, finish) {
  var self = this;

  // allow users to come back to the list view and still see the same
  var status = this.getParam("form_show", this.fromSession("form_show", "N"));
  this.toSession("form_show", status);
  self.context.form_show = status;

  var meta = this.getParam("form_meta", this.fromSession("form_meta", "N"));
  this.toSession("form_meta", meta);

  console.log("FormDataController.listData ->  meta = " + meta + ", status = " + status);

  finish();
};


FormDataController.prototype.saveData = function(id, meta, finish) {
  var self = this;

  // make meta object, read data, save (update or insert depending on availability of an id)

  finish();
};


FormDataController.prototype.editData = function(id, finish) {
  var self = this;

  // fetch data, parse, get meta object, add data, generate html

  finish();
};

//
// Johan Coppieters - apr 2014 - Cody - beta 1
//
// beta 2: added "label" and "hide" in cols.
//         added loopLabelList (for iterating over the cols)
//
// planned: beta 3: remove console.log's
//
var cody = require("../index.js");
console.log("loading " + module.id);

function Model(theController, options) {
  if (theController != null) {
    this.controller = theController;
    theController.model = this;
  }

  this.tableName = options.tableName;
  this.id = options.id || {name: "id", def: 0};

  // cols: array with objects containing meta data and values
  //   {name: "username", def: "", list: true, sort: "asc", q: "like"}
  //
  //  name=..., def=default value, list=appears with doList is called, sort...,
  //  like=when there are q.name params use this operator

  this.cols = options.cols;


  // refs: array with objects containing per reference table
  //  - (name, query) to be fetched and set upon "doGet"  or
  //  - (name, array) to be set upon "doGet"
  //
  this.refs = options.refs || [];
}
module.exports = Model;

/* Example: User model
var aUser = new cody.Model(this, {
  tableName: "patients",
  id: {name: "id", def: 0},
  cols: [
    {name: "name", def: "", list: true, sort: "asc"},
    {name: "firstname", def: "", list: true, sort: "asc"},
    {name: "street", label: "Street", def: "", list: true},
    {name: "town", label: "Town", def: "", list: true},
    {name: "tel1", label: "Phone 1", def: "", list: true},
    {name: "tel2", label: "Phone 2", def: "", list: true},
    {name: "active", label: "Active", def: "Y", list: true, hide: true},
    {name: "email", label: "Email", def: "", list: true}]
});

*/

Model.prototype.addRef = function(name, list) {
  this.refs.push({name: name, list: list});
};

Model.prototype.getId = function() {
  return (typeof this.id.val !== "undefined") ? this.id.val : this.id.def;
};
Model.prototype.getString = function() {
  var n = this.cols.reduce(function(prev, curr) { return prev + ((curr.name === "name") ? curr.val : ""); }, "");
  return n + " [" + this.id.name + "=" + this.id.val + "]";
};
Model.prototype.getEmpty = function() {
  var r = {};
  r[this.id.name] = this.id.def;
  return r;
};

Model.prototype.getNameList = function() {
  return this.cols
    .map(function(ele) { return ele.name; })
    .join(", ");
};
Model.prototype.getUpdateList = function() {
  return this.cols
    .map(function(ele) { return ele.name + "=?"; })
    .join(", ");
};

Model.prototype.getListList = function() {
  return this.cols
    .filter(function(ele) { return ele.list; })
    .map(function(ele) { return ele.name; })
    .join(", ");
};
Model.prototype.loopLabelList = function(render) {
  this.cols
    .filter(function(ele) { return ele.list && ! ele.hide; })
    .forEach(function(ele) { render(ele.label); });
}

Model.prototype.getOrderBy = function() {
  return this.cols
    .filter(function(ele) { return ele.sort; })
    .map(function(ele) { return ele.name + " " + ele.sort; })
    .join(", ");
};
Model.prototype.getWhere = function() {
  var wl = this.cols
    .filter(function(ele) { return ele.q; })
    .map(function(ele) { return ele.name+" "+ele.q+" ?"; })
    .join(" and ");

  return (wl.length === 0) ? "" : " where " + wl;
};


Model.prototype.makeInsert = function() {
  var qs = this.cols.map(function(ele) { return "?"; }).join(",");
  return "insert into " + this.tableName + " (" + this.getNameList() + ") " + " values (" + qs + ")";
};
Model.prototype.makeUpdate = function() {
  return "update " + this.tableName + " set " + this.getUpdateList() + " where " + this.id.name + " = ?";
};
Model.prototype.makeSelect = function() {
  return "select " + this.id.name + "," + this.getNameList() + " from " + this.tableName + " where " + this.id.name + " = ?";
};
Model.prototype.makeDelete = function() {
  return "delete from " + this.tableName + " where " + this.id.name + " = ?";
};

Model.prototype.makeList = function() {
  return "select " + this.id.name + "," + this.getListList() + " from " + this.tableName + this.getWhere() + " order by " + this.getOrderBy();
};


Model.prototype.scrapeFrom = function() {
  var self = this;

  self.cols.forEach(function(ele) {
    ele.val = self.controller.getParam(ele.name, ele.def);
    if (Array.isArray(ele.val)) ele.val = ele.val.join(",");
    console.log("scraped: " + ele.name + " = " + ele.val);
  });
  self.id.val = self.controller.getParam(self.id.name, self.id.def);
  console.log("scraped: " + self.getString());
};


Model.prototype.doDelete = function( theId, finish ) {
  var self = this;

  self.controller.query(self.makeDelete(), [theId], function(err, result) {
    if (err) {
      self.controller.feedBack(false, "Failed to delete the record " + theId + " from " + self.tableName);
    } else {
      self.controller.feedBack(true, "Successfully deleted a record " + theId + " from " + self.tableName);
    }
    finish();
  });
};




Model.prototype.doSave = function( finish ) {
  var self = this;

  var values = self.cols.map(function(ele) { return ele.val; });

  if (self.id.val === self.id.def) {
    // no id -> a new record -> insert
    console.log("query: " + self.makeInsert() + " <- " + values);
    self.controller.query(self.makeInsert(), values, function(err, result){
      if (err) {
        console.log("error inserting into " + self.tableName + " -> " + err);
        self.controller.feedBack(true, "Error inserting a record in " + self.tableName);
      } else {
        self.id.val = result.insertId;
        console.log("generated id -> " + self.getString());
        self.controller.feedBack(true, "Successfully a record in " + self.tableName);
      }
      finish();
    });

  } else {
    // an existing record -> update
    // add the id to the end of the list
    values.push(self.id.val);

    console.log("query: " + self.makeUpdate() + " <- " + values);
    self.controller.query(self.makeUpdate(), values, function(err, result){
      if (err) {
        console.log("error updating " + self.tableName + ", record = " + self.getString() + " -> " + err);
        self.controller.feedBack(true, "Error updating the record = " + self.getString() + " in " + self.tableName);
      } else {
        self.controller.feedBack(true, "Successfully updated the record = " + self.getString() + " in " + self.tableName);
      }
      finish();
    });
  }
};

Model.prototype.doGetRefs = function(finish) {
  var self = this;

  cody.Application.each(self.refs, function(done) {
    if (typeof this.list === "String") {
      // "list" is a string containing a query
      self.controller.query(this.list, [], function(err, results) {
        self.controller.context[this.name] = results;
        done();
      });

    } else {
      // "list" is an array containing the values
      self.controller.context[this.name] = this.list;
      done();
    }
  }, finish);
};

Model.prototype.doGet = function(theId, finish) {
  var self = this;

  self.doGetRefs( function() {
    if ((theId === undefined) || isNaN(theId) || (theId === self.id.def)) {
      self.controller.context.record = self.getEmpty();
      self.id.val = self.id.def;
      finish();

    } else {
      console.log("query: " + self.makeSelect() + " <- " + theId);
      self.controller.query(self.makeSelect(), [theId], function(err, result) {
        if (result.length > 0) {
          self.controller.context.record = result[0];
          self.id.val = theId;
        } else {
          self.controller.context.record = self.getEmpty();
          self.id.val = 0;
        }
        finish();
      });
    }
  });
};


Model.prototype.doList = function(finish) {
  var self = this;

  // get search params
  //  - into "record" for reference in the template
  //  - and into "q" for the query.
  var record = {};
  var q = [];
  self.cols.forEach(function(ele) { console.log("dolist -> " + ele.name + " / " + ele.q);
    if (ele.q !== undefined) {
      // if this column has a q option set in the model ("like", "=", "<", ...)
      var val = self.controller.getParam("q."+ele.name, ele.def);

      // if the returned value is an array, we've got a multiple select form element
      // convert the returned array in a comma separated list
      if (Array.isArray(val)) { val = val.join("%"); }

      // remember the value in the "record" element,
      //  perhaps it is displayed in the search result list
      record[ele.name] = val;

      // for "like"s we add % before and after, others should match exactly
      q.push((ele.q === "like") ? ("%" + val + "%") : val);
    }
  });
  self.controller.context.record = record;

  console.log("made search params: " + q.join("|"));

  // fetch the list
  console.log("list records: " + q.join("|") + " -> " + self.makeList());
  self.controller.query(self.makeList(), q, function(err, result) {
    if (err) {
      console.log("error searching for records " + self.tableName + ", search params = " + q.join("|") + " -> " + err);
      console.log("error searching, while using: " + self.makeList());
      self.controller.feedBack(true, "Error searching for records in " + self.tableName);
    } else {
      self.controller.context.records = result;
    }

    self.doGetRefs(finish);
  });
};


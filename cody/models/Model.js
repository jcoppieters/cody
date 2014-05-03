
//
// Johan Coppieters - apr 2014 - Cody
//
//
var cody = require("../index.js");
console.log("loading " + module.id);

function Model(theController, tableName, idName, colNames, defValues, qNames) {
  this.controller = theController;
  this.tableName = tableName;
  this.idName = idName;
  this.colNames = colNames;
  this.defValues = defValues;
  this.qNames = (typeof qNames === "undefined") ? [] : qNames;

  // - make question mark list, as long as there are colNames
  // - make an update list "colname = ?, ..."
  // - make an valuelist, init with defaultList
  this.qList = [];
  this.valueList = [];
  var updateArr = [];

  for (var iN in colNames) {
    this.qList.push("?");
    updateArr.push(colNames[iN]+"=?");
    this.valueList[iN] = defValues[iN];
  }
  this.updateList = updateArr.join(", ");

  // array with objects containing per reference table
  //  - (name, query) to be fetched and set upon "doGet"
  //  - (name, array) to be set upon "doGet"
  //
  this.refs = [];
}
module.exports = Model;


Model.prototype.addRef = function(name, list) {
  this.refs.push({name: name, list: list});
};


Model.prototype.scrapeFrom = function() {
  for (var iN in this.colNames) {
    this.valueList[iN] = this.controller.getParam(this.colNames[iN], this.defValues[iN]);
    if (Array.isArray(this.valueList[iN])) this.valueList[iN] = this.valueList[iN].join(",");
    // console.log(this.colNames[iN] + " = " + this.valueList[iN]);
  }
};


Model.prototype.doDelete = function( theId, finish ) {
  var self = this;

  this.controller.query("delete from " + self.tableName + " where id = ?", [theId], function() {
    if (err) {
      this.controller.feedBack(false, "Failed to delete the record " + theId + " from " + self.tableName);
    } else {
      this.controller.feedBack(true, "Successfully deleted a record " + theId + " from " + self.tableName);
    }
    finish();
  });
};


Model.prototype.makeInsert = function() {
  return "insert into " + this.tableName +
    " (" + this.colNames.join(",") + ") " +
    " values (" + this.qList.join(",") + ")";
};
Model.prototype.makeUpdate = function() {
  return "update " + this.tableName +
    " set " + this.updateList +
    " where " + this.idName + " = ?";
};
Model.prototype.makeSelect = function() {
  return "select * from " + this.tableName + " where id = ?";
};
Model.prototype.makeList = function() {
  return "select * from " + this.tableName + " order by " + this.colNames[1];
};


Model.prototype.doSave = function( theId, finish ) {
  var self = this;

  if ((typeof theId === "undefined") || (theId === 0)) {

    // no id -> a new record -> insert
    console.log("query: " + self.makeInsert() + " <- " + self.valueList);
    this.controller.query(self.makeInsert(), self.valueList, function(err, result){
      if (err) {
        console.log("error inserting into " + self.tableName + " -> " + err);
        this.controller.feedBack(true, "Error inserting a record in " + self.tableName);
      } else {
        this.controller.feedBack(true, "Successfully a record in " + self.tableName);
      }
      finish();
    });

  } else {
    // an existing record -> update
    // add the id to the end of the list
    self.valueList.push(theId);

    console.log("query: " + self.makeUpdate() + " <- " + self.valueList);
    this.controller.query(self.makeUpdate(), self.valueList, function(err, result){
      if (err) {
        console.log("error updating " + self.tableName + ", id = " + theId + " -> " + err);
        self.controller.feedBack(true, "Error updating the record " + theId + " in " + self.tableName);
      } else {
        self.controller.feedBack(true, "Successfully updated the record " + theId + " in " + self.tableName);
      }
      finish();
    });
  }
};

Model.prototype.doGetRefs = function(finish) {
  var self = this;

  cody.Application.each(this.refs, function(done) {
    if (typeof this.list === "String") {
      // "refs" is a string containing a query
      self.controller.query(this.list, [], function(err, results) {
        self.controller.context[this.name] = results;
        done();
      });

    } else {
      // "refs" is an array containing the values
      self.controller.context[this.name] = this.list;
      done();
    }
  }, finish);
};

Model.prototype.doGet = function(theId, finish) {
  var self = this;

  self.doGetRefs( function() {
    if ((typeof theId === "undefined") || isNaN(theId) || (theId <= 0)) {
      self.controller.context.record = {id: 0};
      finish();

    } else {
      console.log("query: " + self.makeSelect() + " <- " + theId);
      self.controller.query(self.makeSelect(), [theId], function(err, result) {
        if (result.length > 0) {
          self.controller.context.record = result[0];
        } else {
          self.controller.context.record = {};
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
  var val;
  var record = {};
  self.q = [];
  for (var iN in this.qNames) {
    val = this.controller.getParam("q."+this.qNames[iN], "")
    self.q.push(val);
    record[self.qNames[iN]] = val;
  }
  self.controller.context.record = record;

  // fetch the list
  this.controller.query(self.makeList(), self.q, function(err, result) {
    self.controller.context.records = result;

    self.doGetRefs(finish);
  });
};


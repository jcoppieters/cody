//
// Johan Coppieters - jan 2013 - jWorks
//
//
var mysql = require('mysql');
var cody = require('../index.js');

console.log("loading " + module.id);


FormController.makeMeta = function( atom ) {
  var elements = (atom) ? atom.getChildren() : [];
  var arr = [];
  for (var iE in elements) {
    arr.push(elements[iE].note);
  }
  var form = new cody.Meta();
  form.metaId = atom.id;
  form.addList(arr);
  return form;
};

FormController.makeFormInfo = function( atom, page ) {
  var formInfo = (atom && atom.note && (atom.note.length > 2)) ? JSON.parse(atom.note) : {};
  if (typeof formInfo.url === "undefined") {
    formInfo.url = page.getURL(page.language);
  }
  return formInfo;
};

FormController.menuList = function( atoms, current ) {
  var root = atoms[cody.Application.kFormRoot];

  var options = "";
  var currId = (current) ? current.id : 0;
  var aList = root.getChildren();
  for (var x in aList) {
    options += "<option value='" + aList[x].id + "'" + ((currId == aList[x].id) ? " selected" : "") + ">" + aList[x].name + "</option>";
  }
  // console.log("current = " + currId + ", menuPopup -> " + options);
  return options;
};

function FormController(context) {
  console.log("FormController.constructor -> page(" + context.page.itemId + ") = " + context.page.title + ", request = " + context.request);
  
  // init inherited controller
  cody.TreeController.call(this, context);
  
}

FormController.prototype = Object.create( cody.TreeController.prototype );
module.exports = FormController;



FormController.prototype.doRequest = function( finish ) {
  var self = this;

  cody.TreeController.prototype.doRequest.call(self, finish);
};


FormController.prototype.getRoot = function() {
  return cody.Application.kFormRoot;
};
FormController.prototype.getType = function(theNode) { 
  return ((theNode.extention === "xxx") || (theNode.extention === "")) ? "form" : "item";
};
FormController.prototype.getObject = function(id) {
  return this.app.getAtom(id);
};
FormController.prototype.getFolder = function() { 
  return "/forms";
};


/* Overridden - Action functions */
FormController.prototype.emptyLabels = function(isForm) {
  var self = this;
  var labels = {};
  for (var iL in self.app.languages) {
    labels[self.app.languages[iL].id] = (isForm) ? "Send" : self.context.atom.name;
  }
  if (isForm) {
    labels["nl"] = "Verstuur";
    labels["fr"] = "Envoyer";
    labels["de"] = "Versenden";
  }
  return labels;
};


FormController.prototype.isMultiple = function( aGenerator ) {
  return ((aGenerator === cody.Meta.Generator.checkboxinput) ||
          (aGenerator === cody.Meta.Generator.selectinput) ||
          (aGenerator === cody.Meta.Generator.radioinput));
};


// overridden function for forms
FormController.prototype.fetchNode = function( theNode, finish ) {
  var self = this;


  cody.TreeController.prototype.fetchNode.call(this, theNode, function() {
    var isForm = (self.context.atom.extention === "");
    console.log("FormController.FetchNode: node = " + theNode + " -> " + self.context.atom.name + " / " + self.context.atom.extention);

    // get the definitions from the "note" field in the atoms
    var obj = { name: self.context.atom.name, options: {}, labels: self.emptyLabels((self.context.atom.extention === "")), generator: 1 };

    // add email alert address for forms.
    if (isForm) { obj.alert = ""; }

    try {
      var tryObj = JSON.parse(self.context.atom.note);
      if ((typeof tryObj !== "undefined") && (tryObj)) { obj = tryObj; }
    } catch(e) {
    }
    self.context.object = obj;

    if (isForm) {
      // a form, nothing more needed.
      finish();

    } else {
      // an item

      if (typeof obj.options === "undefined") {
        obj.options = {};
      }

      // the options below are shown in 2 fields called min/max
      if (obj.generator == cody.Meta.Generator.textareainput) {
        obj.min = (typeof obj.options.cols === "undefined") ? "" : obj.options.cols;
        obj.max = (typeof obj.options.rows === "undefined") ? "" : obj.options.rows;
      } else {
        obj.min = (typeof obj.options.minimum === "undefined") ? "" : obj.options.minimum;
        obj.max = (typeof obj.options.maximum === "undefined") ? "" : obj.options.maximum;
      }
      if (self.isMultiple(obj.generator)){
        if (typeof obj.options.choices !== "undefined") {
          for (var iC in obj.options.choices) {
            var C = obj.options.choices[iC];
            var X = "";
            for (var iL in C) {
              X += iL + "|" + C[iL] + "\n";
            }
            obj.options.choices[iC] = X.slice(0, -1);
          }
        }
      }
      finish();
    }
  });
};



// overridden function for forms
//
// Read all meta definitions from the posted form
//  1) decide what reader should be taken, based on the "generator"
//    + some parameters (phone, number, email, date, date3)
//  2) read labels
//  3) read choices (for checkboxes, radio's, popup's)
//  4) read specific options (required, default value, ...)
//
// Finally store in an atom/object

FormController.prototype.saveInfo = function( nodeId, finish ) {
  var self = this;
  console.log("FormController.saveInfo: node = " + nodeId );

  var anObject = this.getObject(cody.TreeController.toId(nodeId));
  if (typeof anObject !== "undefined") {

    // read the basics for an atom and for an form/item
    anObject.scrapeFrom(this);
    var obj = { name: anObject.name, labels: {} };

    // read the labels in all languages
    for (var iL in self.app.languages) {
      var L = self.app.languages[iL].id;
      obj.labels[L] = this.getParam("label-"+L, "");
    }

    // We use the extension field in the atom table to make the difference between forms and form-items.
    if (anObject.extention === "") {
      // form
      obj.alert = self.getParam("alert", "");
      self.context.shownode = anObject.id;
      self.context.opennode = anObject.id;

    } else {
      // item
      self.context.shownode = anObject.parentId;
      self.context.opennode = anObject.parentId;

      // next (long) section fills in the correct values for "generator" and "options"
      // depending on the user's choice of the different parameters (required, validation, generator, min/max, ...)
      var aGenerator = parseInt(self.getParam("generator", cody.Meta.Generator.textinput), 10);
      obj.generator = aGenerator;
      obj.options = {};
      obj.reader = cody.Meta.Reader.string;

      var defV = this.getParam("default", "");
      if (defV !== "") {
        obj.options.default = defV;
      }

      if ((this.getParam("required", "N") === "Y") &&
          (aGenerator !== cody.Meta.Generator.checkboxinput)) {
        obj.options.required = true;
      }

      // add validation text or number
      var validation = this.getParam("validation", "X");
      if ((aGenerator === cody.Meta.Generator.textinput) ||
          (aGenerator === cody.Meta.Generator.textareainput)) {
        if (validation === "E") {
          obj.options.email = true;
          obj.reader = cody.Meta.Reader.email;
        } else if (validation === "P") {
          obj.options.phone = true;
          obj.reader = cody.Meta.Reader.phone;
        }
      } else if (aGenerator === cody.Meta.Generator.numberinput) {
        obj.options.number = true;
        if (validation === "I") {
          obj.reader = cody.Meta.Reader.integer;
        } else { // === "N"
          obj.reader = cody.Meta.Reader.number;
        }
      }

      // add min/max or cols/rows
      var aMin = self.getParam("min", "");
      var aMax = self.getParam("max", "");
      if (aGenerator === cody.Meta.Generator.textareainput) {
        if (aMin !== "") { obj.options.cols = aMin; }
        if (aMax !== "") { obj.options.rows = aMax; }
      } else if ((aGenerator === cody.Meta.Generator.numberinput) || (aGenerator === cody.Meta.Generator.textinput)) {
        if (aMin !== "") { obj.options.minimum = aMin; }
        if (aMax !== "") { obj.options.maximum = aMax; }
      }

      // add choices in all languages
      // there is one field (choice-[language]) for every language
      // one choice per line and possibly in the format "[id]|[label]"
      // the user can enter his list without "[id]|", we will add it on next edit
      if (this.isMultiple(aGenerator)){
        if (aGenerator === cody.Meta.Generator.checkbox) {
          obj.reader = cody.Meta.Reader.multiple;
        }
        obj.options.choices = {};

        for (var iL in self.app.languages) {
          var L = self.app.languages[iL].id;
          obj.options.choices[L] = {};
          var arr = self.getParam("choice-"+L, "").replace("\r", "").split("\n");

          if (arr[0].indexOf("|") > 0) {
            // user has given keys value pairs
            for (var i in arr) {
              var cInx = arr[i].indexOf("|");
              var cID = arr[i].substring(0, cInx);
              obj.options.choices[L][cID] = arr[i].substring(cInx+1);
            }
          } else {
            // no keys, only choices, we'll label them 0, 1, 2 ,...
            for (var i in arr) {
              obj.options.choices[L][i] = arr[i];
            }
          }
        }
      }

      // Date readers (1 field or 3 fields)
      if (aGenerator === cody.Meta.Generator.dateinput) {
        obj.reader = cody.Meta.Reader.date;
      } else if (aGenerator === cody.Meta.Generator.date3input) {
        obj.reader = cody.Meta.Reader.date3;
      }

    }
    console.log("show / open -> " + self.context.shownode + " / " + self.context.opennode);
    var str = JSON.stringify(obj);
    console.log("Generated Meta: " + str);
    anObject.note = str;
    anObject.doUpdate(self, finish);

  } else {
    this.feedBack(false, "failed to save the data");
    finish();
  }
};

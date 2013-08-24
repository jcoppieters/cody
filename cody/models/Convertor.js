//
// Johan Coppieters - aug 2013 - cody
//
//
"use strict"

//console.log("loading " + module.id);

//var cody = require("./../index.js");


function Convertor(metas) {
  this.objects = [];
  this.names = {};
  this.ok = true;
  if (typeof metas !== "undefined") {
    for (var iM in metas) {
      this.add(metas[iM].name, metas[iM].options, metas[iM].generator, metas[iM].labels);
    }
  }
}

// module.exports = Convertor;

Convertor.kOK = 0;
Convertor.kTooSmall = 1;
Convertor.kTooBig = 2;
Convertor.kRequired = 3;
Convertor.kNoNumber = 4;


var nlArray = {};
  nlArray[Convertor.kOK] = "OK";
  nlArray[Convertor.kTooSmall] = "Te klein";
  nlArray[Convertor.kTooBig] = "Te groot";
  nlArray[Convertor.kRequired] = "Verplicht";
  nlArray[Convertor.kNoNumber] = "Geen getal";

var enArray = {};
  enArray[Convertor.kOK] = "OK";
  enArray[Convertor.kTooSmall] = "Too small";
  enArray[Convertor.kTooBig] = "Too big";
  enArray[Convertor.kRequired] = "Required";
  enArray[Convertor.kNoNumber] = "No number";

Convertor.localisation = {
  "nl": nlArray,
  "en": enArray
};


Convertor.prototype.add = function( name, options, generator, labels ) {
  this.names[name] = this.values.length;
  this.objects.push({name: name, value: options.default, options: options, generator: generator, labels: labels});
};

Convertor.prototype.get = function( name ) {
  return this.objects[this.names[name]].value;
};

Convertor.prototype.values = function() {
  var vals = {};
  for (var iO in this.objects) {
    var O = this.objects[iO];
    vals[O.name] = O.value;
  }
  return vals;
}
Convertor.prototype.errors = function(lang) {
  if (typeof lang === "undefined") lang = "en";
  var errs = [];
  for (var iO in this.objects) {
    var O = this.objects[iO];
    if (typeof O.error !== "undefined") {
      errs.push({name: O.name, label: O.labels[lang], error: O.error, value: O.value, errstr: Convertor.localisation[lang][O.error]});
    }
  }
  return errs;
}

Convertor.prototype.reset = function() {
  this.ok = true;
  for (var iO in this.objects) {
    var O = this.objects[iO];
    delete O.error;
    O.value = O.options.default;
  }
}

Convertor.prototype.readFrom = function( params ) {
  this.reset();

  for (var iO in this.objects) {
    var O = this.objects[iO];
    var raw = params[O.name];
    var native = O.options.convert(raw, O);
    if (typeof O.error !== "undefined") {
      this.ok = false;
    }
    O.value = native;
  }
}

Convertor.prototype.html = function( lang ) {
  if (typeof lang === "undefined") lang = "en";
  var html = "";

  for (var iO in this.objects) {
    var O = this.objects[iO];
    html += O.generator(lang, O);
  }

  return html;
}


/* convertor functions */

Convertor.integer = function(value, object) {
  if (typeof value === "undefined") {
    if (object.options.required) {
      object.error = Convertor.kRequired;
      return undefined;
    } else {
      return object.options.default;
    }
  }
  try {
    var i = parseInt(value, 10);

    if (isNaN(i)) {
      object.error = Convertor.kNoNumber;
      return undefined;

    } else if (object.options.maximum && i > object.options.maximum) {
      object.error = Convertor.kTooBig;
      return undefined;

    } else if (object.options.minimum && i < object.options.minimum) {
      object.error = Convertor.kTooSmall;
      return undefined;

    }
    return i;

  } catch(e) {
    console.log("Convertor.integer -> " + e);
    object.error = Convertor.kNoNumber;
    return undefined;

  }
};


/* Meta descriptors */

Convertor.color = {
  convert: Convertor.integer,
  maximum: 255,
  minimum: 0,
  required: true,
  default: 127
};
Convertor.positive = {
  convert: Convertor.integer,
  minimum: 0,
  required: true,
  default: 0
};
Convertor.requiredString = {
  convert: function(value, object) {
    if (typeof value === undefined) {
      object.error = Convertor.kRequired;
      return undefined;
    } else {
      return value;
    }
  }
}
Convertor.defaultString = {
  convert: function(value, object) {
    if (typeof value === undefined) {
      return object.options.default;
    } else {
      return value;
    }
  }
}

/* Meta generators */
Convertor.textinput = function(lang, object) {
  if (typeof lang === "undefined") lang = "en";
  var val = (typeof object.value === "undefined") ? "" : (" value='" + object.value + "'");
  return "<div><label>"+ object.labels[lang] + "</label><input type='text' name='" + object.name + "' id='" + object.name + "'" + val +"></div>";
}


/* demo */

var X = new Convertor();

X.add("width", Convertor.positive, Convertor.textinput, {"en": "Width", "nl": "Breedte"} );
X.add("height", { convert: Convertor.integer, default: 10}, Convertor.textinput, {"en": "Width", "nl": "Breedte"});
X.add("red", Convertor.color, Convertor.textinput, {"en": "Red", "nl": "Rood"});
X.add("green", Convertor.color, Convertor.textinput, {"en": "Green", "nl": "Groen"});
X.add("blue", Convertor.color, Convertor.textinput, {"en": "Blue", "nl": "Blauw"});


Convertor.kBadName = 1001;
Convertor.localisation.nl[Convertor.kBadName] = "Slechte name";
Convertor.localisation.en[Convertor.kBadName] = "Bad name";

X.add("name", {
  convert: function(value, object) {
    if ((typeof value != undefined) && (value.indexOf("Cody") > 0)) {
      return "Cody is a good name";
    } else {
      object.error = Convertor.kBadName;
      return "Super Cody";
    }
  }
}, Convertor.textinput, { "en": "Best CMS", "nl": "Beste CMS ooit"});



var P = {"width": "10", "red": "122", "blue": "333", "name": "nobody"};
X.readFrom(P);
console.log("Params = ");console.log(P);
console.log("Values = ");console.log(X.values());
console.log("Errors = ");console.log(X.errors());
console.log("HTML = ");console.log(X.html());

P = {"width": "10", "red": "111", "green": "121", "blue": "222", "name": "Cody CMS"};
X.reset();
console.log("HTML empty = ");console.log(X.html("nl"));
X.readFrom(P);
console.log("Params = ");console.log(P);
console.log("Values = ");console.log(X.values());
console.log("Errors = ");console.log(X.errors("nl"));
console.log("HTML with values = ");console.log(X.html("nl"));

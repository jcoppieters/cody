//
// Johan Coppieters - aug 2013 - cody
//
//

console.log("loading " + module.id);



function Meta(plainObject) {
  this.objects = [];
  this.names = {};
  this.ok = true;
  this.metaId = 0;
  this.objectId = 0;

  if (typeof plainObject !== "undefined") {
    this.setDefinition(plainObject);
  }
}

Meta.Reader = {};
Meta.Reader.readers = [];
Meta.Reader.debug = true;

Meta.Generator = {};
Meta.Generator.generators = [];

Meta.Messages = {};
Meta.Messages.messages = {};

module.exports = Meta;


Meta.getData = function(result) {
  return {
    id: result.id,
    atom: result.atom,
    data: ((typeof result.data === "undefined") || (result.data.length < 2)) ? {} : JSON.parse(result.data),
    status: result.status,
    statusname: (result.status === "N") ? "New" : (result.status === "T") ? "To do" : "Done",
    created: result.created,
    modified: result.modified
  };
};


/* Standard Readers

 Meta.Reader.number
 Meta.Reader.string
 Meta.Reader.email
 Meta.Reader.date
 Meta.Reader.date3
 Meta.Reader.multiple
 Meta.Reader.phone
 Meta.Reader.integer

 */

/********************************/
/* Localized Message management */
/********************************/

Meta.Messages.kOK = 0;
Meta.Messages.kTooSmall = 1;
Meta.Messages.kTooBig = 2;
Meta.Messages.kRequired = 3;
Meta.Messages.kNoNumber = 4;
Meta.Messages.kTooLong = 5;
Meta.Messages.kTooShort = 6;
Meta.Messages.kInvalidEmail = 7;
Meta.Messages.kInvalidPhone = 8;

//TODO: load from json
Meta.Messages.addStdMessages = function() {
  this.addMessage("nl", Meta.Messages.kOK, "OK");
  this.addMessage("nl", Meta.Messages.kTooSmall, "Te klein");
  this.addMessage("nl", Meta.Messages.kTooBig, "Te groot");
  this.addMessage("nl", Meta.Messages.kRequired, "Verplicht veld");
  this.addMessage("nl", Meta.Messages.kNoNumber, "Geen getal");
  this.addMessage("nl", Meta.Messages.kTooLong, "Te lang");
  this.addMessage("nl", Meta.Messages.kTooShort, "Te kort");
  this.addMessage("nl", Meta.Messages.kInvalidEmail, "Geen geldig email adres");
  this.addMessage("nl", Meta.Messages.kInvalidPhone, "Geen geldig telefoon nummer");

  this.addMessage("en", Meta.Messages.kOK, "OK");
  this.addMessage("en", Meta.Messages.kTooSmall, "Too small");
  this.addMessage("en", Meta.Messages.kTooBig, "Too big");
  this.addMessage("en", Meta.Messages.kRequired, "Required value");
  this.addMessage("en", Meta.Messages.kNoNumber, "No number");
  this.addMessage("en", Meta.Messages.kTooLong, "Too long");
  this.addMessage("en", Meta.Messages.kTooShort, "Too Short");
  this.addMessage("en", Meta.Messages.kInvalidEmail, "Invalid email address");
  this.addMessage("en", Meta.Messages.kInvalidPhone, "Invalid phone number");

  this.addMessage("fr", Meta.Messages.kOK, "OK");
  this.addMessage("fr", Meta.Messages.kTooSmall, "Trop petit");
  this.addMessage("fr", Meta.Messages.kTooBig, "Trop grand");
  this.addMessage("fr", Meta.Messages.kRequired, "Valeur obligatoir");
  this.addMessage("fr", Meta.Messages.kNoNumber, "Pas de numéro");
  this.addMessage("fr", Meta.Messages.kTooLong, "Trop longue");
  this.addMessage("fr", Meta.Messages.kTooShort, "Trop court");
  this.addMessage("fr", Meta.Messages.kInvalidEmail, "Adresse email invalide");
  this.addMessage("fr", Meta.Messages.kInvalidPhone, "Numéro de téléphone incorrect");

  this.addMessage("de", Meta.Messages.kOK, "OK");
  this.addMessage("de", Meta.Messages.kTooSmall, "Zu klein");
  this.addMessage("de", Meta.Messages.kTooBig, "Zu groß");
  this.addMessage("de", Meta.Messages.kRequired, "Pflichtfeld");
  this.addMessage("de", Meta.Messages.kNoNumber, "keine Nummer");
  this.addMessage("de", Meta.Messages.kTooLong, "Zu lange");
  this.addMessage("de", Meta.Messages.kTooShort, "Zu kurz");
  this.addMessage("de", Meta.Messages.kInvalidEmail, "Ungültige E-Mail-Adresse");
  this.addMessage("de", Meta.Messages.kInvalidPhone, "Ungültige Telefonnummer");
};

Meta.Messages.addMessage = function(language, messageId, messageString) {
  //  key/value pair  add(language, key, value)
  if (typeof Meta.Messages.messages[language] === "undefined") {
    Meta.Messages.messages[language] = {};
  }
  Meta.Messages.messages[language][messageId] = messageString;
}

Meta.Messages.getMessage = function(language, messageId) {
  return ((typeof Meta.Messages.messages[language] !== "undefined") &&
    (typeof Meta.Messages.messages[language][messageId] !== "undefined"))
    ? Meta.Messages.messages[language][messageId]
    : ("undefined error: " + messageId);
}

Meta.Messages.addStdMessages();


/******************************/
/* Meta definition management */
/******************************/

Meta.prototype.add = function( params ) {
  // params = {name, options, generator, labels}
  //  accept strings and objects
  if ((typeof params === "string") && (params.indexOf("{") >= 0)) {
    params = JSON.parse(params);
  }

  // clone object
  var object = {};
  for (var oi in params) {
    object[oi] = params[oi];
  }
  // generate unique id and add to params
  this.names[object.name] = this.objects.length;
  object.id = this.objects.length;

  // add value if not already in it
  object.value = this.getValue(object);

  // remember in our objects array
  this.objects.push(object);
};
Meta.prototype.addList = function( arr ) {
  for (var iA in arr) {
    this.add(arr[iA]);
  }
}


Meta.prototype.setDefinition = function( plainObject ) {
  this.objects = plainObject.objects;
  this.names = plainObject.names;
  this.metaId = plainObject.metaId;
}

Meta.prototype.saveDefinition = function( controller, done ) {
  var data = JSON.stringify( this );
  if (this.metaId === 0) {
    // insert new record in "meta"
  } else {
    // update definition in "meta"
  }
  if (typeof done === "function") { done(); }
};
Meta.prototype.readDefinition = function( controller, id, done ) {
  // read from database in table "meta" and "add" to ourselfs
  this.metaId = id;

  // get meta from the database and inject
  var data = "{}";
  this.setDefinition( JSON.parse(data) );

  if (typeof done === "function") { done(); }
};


/***************************/
/* Object value management */
/***************************/

Meta.prototype.values = function() {
  var values = {};
  for (var iO in this.objects) {
    var O = this.objects[iO];
    values[O.name] = O.value;
  }
  return values;
};
Meta.prototype.setValues = function(values) {
  for (var iO in this.objects) {
    var O = this.objects[iO];
    O.value = values[O.name];
  }
}

Meta.prototype.errors = function(lang) {
  if (typeof lang === "undefined") { lang = "en"; }
  var errs = [];
  for (var iO in this.objects) {
    var O = this.objects[iO];
    if (typeof O.error !== "undefined") {
      errs.push({name: O.name, label: O.labels[lang], error: O.error, value: O.value, errstr: Meta.Messages.getMessage(lang, O.error)});
    }
  }
  return errs;
};

Meta.prototype.isOk = function() {
  return this.ok;
};

Meta.prototype.reset = function() {
  this.ok = true;
  for (var iO in this.objects) {
    var O = this.objects[iO];
    delete O.error;
    delete O.value;
    O.value = this.getValue(O);
  }
};

Meta.prototype.getValue = function(object) {
  return (typeof object.value !== "undefined") ?
    object.value : ((typeof object.options === "undefined") ?
    undefined : ((object.options.default === "now") ?
    new Date() : object.options.default));
};

Meta.prototype.readValuesFrom = function( params, correct ) {
  this.reset();

  for (var iO in this.objects) {
    var O = this.objects[iO];
    var raw = params[O.name];
    var native = Meta.Reader.readers[O.reader](raw, O, params, correct);
    if (typeof O.error !== "undefined") {
      this.ok = false;
    }
    O.value = native;
    if (Meta.Reader.debug) {
      console.log("readValuesFrom: " + O.name + " -> " + raw + " -> " + native + ", error = " + O.error);
    }
  }
};
Meta.prototype.saveValues = function( controller, status, done ) {
  var self = this;
  var values = self.values();
  var data = JSON.stringify(values);

  if ((typeof this.objectId === "undefined") || (this.objectId === 0)) {
    controller.query("insert into data (atom, data, created, modified, status) values (?, ?, now(), null, 'N')",
      [self.metaId, data],
      function(error, results){
        self.objectId = results.insertId;
        done();
    });

  } else {
    controller.query("update data set data = ?, modified = now(), status = ? where id = ?", [data, status, self.objectId], done);
  }
};

Meta.prototype.readValues = function( controller, id, done ) {
  var self = this;
  this.objectId = id;

  controller.query("select id, atom, data, status, created, modified from data where id = ?", [id], function(error, result) {
    if (error || (result.length != 1)) {
      console.log("Meta.readValues -> error :" + error);
      done(error, undefined);
      return;
    }
    var data = Meta.getData(result[0]);
    if (data.atom == self.metaId) {
      self.setValues( data.data );
    } else {
      console.log("Meta.readValues -> error: *** incompatible data type ***");
      done(new Error("Can not read incompatible data from the database"), undefined);
      return;
    }
    done(undefined, data);
  });
};


/********************/
/* Reader functions */
/********************/

Meta.Reader.makeReader = function(func) {
  Meta.Reader.readers.push(func);
  return Meta.Reader.readers.length-1;
}


Meta.Reader.number = Meta.Reader.makeReader(function(value, object, others, correct) {
  // check undefined / required
  if (typeof value === "undefined") {
    if (object.options.required) {
      object.error = Meta.Messages.kRequired;
      return (correct) ? undefined : "";
    } else {
      return (typeof object.options.default === "undefined") ? ((correct) ? undefined : "") : object.options.default;
    }
  }

  // real integer stuff
  var f = parseFloat(value, 10);

  if (isNaN(f)) {
    object.error = Meta.Messages.kNoNumber;
    return (correct) ? undefined : value;

  } else if (object.options.maximum && f > object.options.maximum) {
    object.error = Meta.Messages.kTooBig;
    return (correct) ? undefined : value;

  } else if (object.options.minimum && f < object.options.minimum) {
    object.error = Meta.Messages.kTooSmall;
    return (correct) ? undefined : value;

  }
  return f;
});

Meta.Reader.string = Meta.Reader.makeReader(function(value, object, others, correct) {
  // check undefined / required
  if (typeof value === "undefined") {
    if (object.options.required) {
      object.error = Meta.Messages.kRequired;
      return (correct) ? undefined : "";
    } else {
      return (typeof object.options.default === "undefined") ? ((correct) ? undefined : "") : object.options.default;
    }
  }

  // real string stuff
  if (object.options.maximum && (value.length > object.options.maximum)) {
    object.error = Meta.Messages.kTooLong;
    return (correct) ? undefined : value;

  } else if (object.options.minimum && (value.length < object.options.minimum)) {
    object.error = Meta.Messages.kTooShort;
    return (correct) ? undefined : value;

  }
  return value;
});

Meta.Reader.email = Meta.Reader.makeReader(function(value, object, others, correct) {
  value = Meta.Reader.readers[Meta.Reader.string](value, object);

  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    return value;
  } else {
    object.error = Meta.Messages.kInvalidEmail;
    return (correct) ? undefined : value;
  }
})

Meta.Reader.date = Meta.Reader.makeReader(function(value, object, others, correct) {
  // allow "now" as value and defaultvalue
  if (value === "now") { console.log("*** value=now ***"); return new Date(); }
  var defD = (object.options.default === "now") ? new Date() : ((correct) ? object.options.default : "");

  if (typeof value === "undefined") {
    if (object.options.required) {
      object.error = Meta.Messages.kRequired;
      return (correct) ? undefined : "";

    } else {
      return defD
    }
  }

  //TODO: read from 1 field, use context.makeDate(object.value, object.options.default)
  var parts = (value.indexOf("-") > 0) ? value.split("-") : value.split("/");
  return (parts.length < 3) ? ((correct) ? defD : value) : new Date(parts[2], ParseInt(parts[1])-1, parts[0]);
});

Meta.Reader.date3 = Meta.Reader.makeReader(function(value, object, others, correct) {
  var yyyy = others[object.name + "_yyyy"],
    mm = others[object.name + "_mm"],
    dd = others[object.name + "_dd"];

  if ((typeof yyyy === "undefined") || (typeof yyyy === "undefined") || (typeof yyyy === "undefined")) {
    return undefined;
  }
  return new Date(yyyy, parseInt(mm)-1, dd);
});


Meta.Reader.multiple = Meta.Reader.makeReader(function(value, object, others, correct) {
  var vals = [];
  for (var first in object.options.choices) { break; }

  for (var i in object.options.choices[first]) {
    var val = others[object.name + "_" + i];
    if (typeof val !== "undefined") { vals.push(val); }
  }
  return vals.join("|");
});

Meta.Reader.phone = Meta.Reader.makeReader(function(value, object, others, correct) {
  // check undefined / required
  var stripped = (typeof value === "undefined") ? "" : value.replace(/[\(\)\.\-\ ]/g, '');
  if ((typeof value === "undefined") || (stripped === "")) {
    if (object.options.required) {
      object.error = Meta.Messages.kRequired;
      return (correct) ? undefined : "";
    } else {
      return (typeof object.options.default === "undefined") ? ((correct) ? undefined : "") : object.options.default;
    }
  }

  if ((! (/^[0-9]+$/.test(stripped))) || (stripped.length < 6)) {
    object.error = Meta.Messages.kInvalidPhone;
    return (correct) ? undefined : value;
  }
  return value;
});

Meta.Reader.integer = Meta.Reader.makeReader(function(value, object, others, correct) {
  // check undefined / required
  if (typeof value === "undefined") {
    if (object.options.required) {
      object.error = Meta.Messages.kRequired;
      return (correct) ? undefined : "";
    } else {
      return (typeof object.options.default === "undefined") ? ((correct) ? undefined : "") : object.options.default;
    }
  }

  // real integer stuff
  var i = parseInt(value, 10);

  if (isNaN(i)) {
    object.error = Meta.Messages.kNoNumber;
    return (correct) ? undefined : value;

  } else if (object.options.maximum && i > object.options.maximum) {
    object.error = Meta.Messages.kTooBig;
    return (correct) ? undefined : value;

  } else if (object.options.minimum && i < object.options.minimum) {
    object.error = Meta.Messages.kTooSmall;
    return (correct) ? undefined : value;

  }
  return i;
});


/********************/
/* Generator Stuff  */
/********************/

Meta.prototype.html = function( lang, formInfo ) {
  if (typeof lang === "undefined") lang = "en";
  var html = "";

  for (var iO in this.objects) {
    var O = this.objects[iO];
    if (typeof Meta.Generator.generators[O.generator] === "function") {
      html += Meta.Generator.generators[O.generator](lang, O);
    }
  }
  var buttonName = (typeof formInfo.labels === "undefined") ? "Send" : formInfo.labels[lang];

  return "<form method='post' action='/" + formInfo.url + "'>" +
    " <input type='hidden' name='request' id='request' value=''>" +
    " <input type='hidden' name='form-atom' id='form-atom' value='" + this.metaId + "'>" +
    " <fieldset>" + html + "</fieldset>" +
    " <div id='action_buttons'>" +
    "  <button id='submitter'>" + buttonName + "</button>" +
    ((typeof formInfo.extraButtons !== "undefined") ? formInfo.extraButtons  : "") +
    " </div>" +
    "</form>";

  // + script voor submitter ?

};


/**************************/
/* Meta.Generator Helpers */
/**************************/

function getClasses(object, extraClass) {
  var x = "";
  if (object.options.required) {
    x = " class='required";
  }
  if (object.options.date) {
    x += (x==="") ? " class='date" : " date";
  }
  if (object.options.email) {
    x += (x==="") ? " class='email" : " email";
  }
  if (object.options.number) {
    x += (x==="") ? " class='number" : " number";
  }
  if ((typeof extraClass !== "undefined") && (extraClass !== "")) {
    x += ((x==="") ? " class='" : " ") + extraClass;
  }
  if (typeof object.error !== "undefined") {
    x += (x==="") ? " class='error" : " error";
  }

  // end the class string
  if (x !== "") { x += "'"; }
  return x;
}

function getAttributes(object) {
  var x = "";
  if (typeof object.options.width !== "undefined") {
    x += " size='" + object.options.width + "'";
  }
  if (typeof object.options.maxlength !== "undefined") {
    x += " maxlength='" + object.options.maxlength + "'";
  }
  if (typeof object.options.cols !== "undefined") {
    x += " cols='" + object.options.cols + "'";
  }
  if (typeof object.options.rows !== "undefined") {
    x += " rows='" + object.options.rows + "'";
  }
  return x;
}

function getErrors(lang, object) {
  if (typeof object.error === "undefined") {
    return "";
  }
  return "<label class='error'>" + Meta.Messages.getMessage(lang, object.error) + "</label>";
}

function validLang(lang) {
  return (typeof lang === "undefined") ? "en" : lang;
}
function getVal(object) {
  return (typeof object.value === "undefined") ? "" : (" value='" + object.value + "'")
}
function getTVal(object) {
  return (typeof object.value === "undefined") ? "" : object.value;
}
function isIn(val, values) {
  for (var i in values) if (val == values[i]) return true;
  return false;
}
function two(n) {
  return (n < 10) ? ("0" + n) : n;
}


/* HTML generators helpers */
function getRadios(lang, object, cls) {
  var s = "";
  for (var i in object.options.choices[lang]) {
    var C = object.options.choices[lang][i];
    s += "<input type='radio' name='" + object.name + "' id='" + object.name + "_" + i + "' value='" + i + "'" + ((object.value === i) ? " checked" : "") + cls + "><label for='" + object.name + "_" + i + "'>" + C + "</label>";
  }
  return s;
}
function getOptions(lang, object) {
  var s = "";
  for (var i in object.options.choices[lang]) {
    var C = object.options.choices[lang][i];
    s += "<option value='" + i + "'" + ((object.value === i) ? " selected" : "") + ">" + C + "</option>";
  }
  return s;
}
function getChecks(lang, object) {
  var s = "";
  var values = (typeof object.value === "undefined") ? [] : object.value.split("|");
  for (var i in object.options.choices[lang]) {
    var C = object.options.choices[lang][i];
    s += "<input type='checkbox' name='" + object.name + "_" + i + "' id='" + object.name + "_" + i + "' value='" + i + "'" + ((isIn(i,values)) ? " checked" : "") + ">" +
      "<label for='" + object.name + "_" + i + "'>" + C + "</label>";
  }
  return s;
}



/**************************/
/* Actual HTML generators */
/**************************/

Meta.Generator.makeGenerator = function(func) {
  Meta.Generator.generators.push(func);
  return Meta.Generator.generators.length - 1;
}


Meta.Generator.numberinput = Meta.Generator.makeGenerator(function(lang, object) {
  lang = validLang(lang);
  var cls = getClasses(object);
  var val = getVal(object);
  var err = getErrors(lang, object);
  return "<div><label for='" + object.name +"'>"+ object.labels[lang] + "</label>" +
    "<input type='text' name='" + object.name + "' id='" + object.name + "'" + val + cls + ">" + err + "</div>\n";
});

Meta.Generator.textinput = Meta.Generator.makeGenerator(function(lang, object) {
  lang = validLang(lang);
  var attr = getAttributes(object);
  var cls = getClasses(object);
  var val = getVal(object);
  var err = getErrors(lang, object);
  return "<div><label for='" + object.name +"'>"+ object.labels[lang] + "</label>" +
    "<input type='text' name='" + object.name + "' id='" + object.name + "'" + val + cls + attr + ">" + err + "</div>\n";
});

Meta.Generator.textareainput = Meta.Generator.makeGenerator(function(lang, object) {
  lang = validLang(lang);
  var attr = getAttributes(object);
  var cls = getClasses(object);
  var val = getTVal(object);
  var err = getErrors(lang, object);
  return "<div><label for='" + object.name +"'>"+ object.labels[lang] + "</label>" +
    "<textarea name='" + object.name + "' id='" + object.name + "'" + cls + attr + ">" + val + "</textarea>" + err + "</div>\n";
});

Meta.Generator.radioinput = Meta.Generator.makeGenerator(function(lang, object) {
  lang = validLang(lang);
  var cls = getClasses(object);
  var err = getErrors(lang, object);
  return "<div><label for='" + object.name +"'>"+ object.labels[lang] + "</label>" +
    "<div class='radios'>" +
    getRadios(lang, object, cls) +
    "</div>" + err + "</div>\n";
});

Meta.Generator.selectinput = Meta.Generator.makeGenerator(function(lang, object) {
  lang = validLang(lang);
  var cls = getClasses(object);
  var err = getErrors(lang, object);
  return "<div><label for='" + object.name +"'>"+ object.labels[lang] + "</label>" +
    "<select name='" + object.name + "' id='" + object.name +"'" + cls + ">" +
    getOptions(lang, object) +
    "</select>" + err + "</div>\n";
});

Meta.Generator.checkboxinput = Meta.Generator.makeGenerator(function(lang, object) {
  lang = validLang(lang);
  var val = getVal(object);
  var cls = getClasses(object);
  var err = getErrors(lang, object);
  return "<div><label for='" + object.name +"'>"+ object.labels[lang] + "</label>" +
    "<div class='checkboxes'>" +
    getChecks(lang, object, cls) +
    "</div>" + err + "</div>\n";
});

Meta.Generator.dateinput = Meta.Generator.makeGenerator(function(lang, object) {
  lang = validLang(lang);
  var attr = getAttributes(object);
  // force a date class
  object.options.date = true;
  var cls = getClasses(object);

  //TODO: use formatDate from context to get localisation right
  var val = "";
  if ((typeof object.value === "object")) {
    val =  " value='" + two(object.value.getDate()) + "-" + two(object.value.getMonth()+1) + "-" + object.value.getFullYear() + "'";
  }

  var err = getErrors(lang, object);
  return "<div><label for='" + object.name +"'>"+ object.labels[lang] + "</label>" +
    "<input type='text' name='" + object.name + "' id='" + object.name + "'" + val + cls + attr + ">" + err + "</div>\n";
});

Meta.Generator.date3input = Meta.Generator.makeGenerator(function(lang, object) {
  lang = validLang(lang);
  var cls_dd = getClasses(object, "date_dd number");
  var cls_mm = getClasses(object, "date_mm number");
  var cls_yyyy = getClasses(object, "date_yyyy number");

  var val_dd = "", val_mm = "", val_yyyy = "";
  if ((typeof object.value === "object")) {
    val_dd = " value='" + two(object.value.getDate()) + "'";
    val_mm = " value='" + two(object.value.getMonth()+1) + "'";
    val_yyyy = " value='" + object.value.getFullYear() + "'";
  }
  var err = getErrors(lang, object);
  return "<div><label for='" + object.name +"'>"+ object.labels[lang] + "</label><div class='date3'>" +
    "<input type='text' name='" + object.name + "_dd' id='" + object.name + "_dd'" + val_dd + cls_dd + " maxlength='2'>" +
    "<input type='text' name='" + object.name + "_mm' id='" + object.name + "_mm'" + val_mm + cls_mm + " maxlength='2'>" +
    "<input type='text' name='" + object.name + "_yyyy' id='" + object.name + "_yyyy'" + val_yyyy + cls_yyyy + " maxlength='4'>" +
    "</div>" + err + "</div>\n";
});


/******************/
/* Demo + testing */
/******************/

/* sample Meta descriptors */

Meta.color = {
  maximum: 255,
  minimum: 0,
  required: true,
  default: 127
};
Meta.positive = {
  minimum: 0,
  required: true,
  default: 0
};


function demo() {
  var X = new Meta();

  // {name, options, generator, labels}
  X.add({
    name: "width",
    options: Meta.positive,
    reader: Meta.Reader.integer,
    generator: Meta.Generator.numberinput,
    labels: {"en": "Width", "nl": "Breedte"}
  });

  X.add({
    name: "height",
    options: { default: 10, number: true, size: 10 },
    reader: Meta.Reader.integer,
    generator: Meta.Generator.numberinput,
    labels: {"en": "Height", "nl": "Hoogte"}
  });

  X.add({
    name: "publish",
    options: { size: 10 },
    reader: Meta.Reader.date,
    generator: Meta.Generator.dateinput,
    labels: {"en": "Publish on", "nl": "publiceer op"}
  });

  X.add({
    name: "saved",
    options: { size: 10, default: "now" },
    reader: Meta.Reader.date,
    generator: Meta.Generator.dateinput,
    labels: {"en": "saved on", "nl": "bewaard op"}
  });

  X.add({
    name: "born",
    options: { required: true },
    reader: Meta.Reader.date3,
    generator: Meta.Generator.date3input,
    labels: {"en": "Born", "nl": "Geboren"}
  });

  X.add({
    name: "note",
    options: { cols: 50, rows: 5 },
    reader: Meta.Reader.string,
    generator: Meta.Generator.textareainput,
    labels: {"en": "Note", "nl": "Nota"}
  });

  X.add({
    name: "red",
    options: Meta.color,
    reader: Meta.Reader.integer,
    generator: Meta.Generator.numberinput,
    labels: {"en": "Red", "nl": "Rood"}
  });

  X.add({
    name: "green",
    options: Meta.color,
    reader: Meta.Reader.integer,
    generator: Meta.Generator.numberinput,
    labels: {"en": "Green", "nl": "Groen"}
  });
  X.add({
    name: "blue",
    options: Meta.color,
    reader: Meta.Reader.integer,
    generator: Meta.Generator.numberinput,
    labels: {"en": "Blue", "nl": "Blauw"}
  });

  X.add({
    name: "email",
    options: { email: true, required: true, size: 50, maxlength: 100 },
    reader: Meta.Reader.email,
    generator: Meta.Generator.textinput,
    labels: {"en": "email address", "nl": "imeel"}
  });

  var choices = {};
  choices["nl"] = { 'M': 'Man', 'F': 'Vrouw'};
  choices["en"] = { 'M': 'Male', 'F': 'Female'};
  X.add({
    name: "sex",
    options: { choices: choices, required: true },
    reader: Meta.Reader.string,
    generator: Meta.Generator.radioinput,
    labels: {"en": "Sex", "nl": "Geslacht"}
  });

  X.add({name: "sexy",
    options: { choices: choices },
    reader: Meta.Reader.string,
    generator: Meta.Generator.selectinput,
    labels: {"en": "Sexje", "nl": "Geslachtje"}
  });

  X.add({name: "phony",
    options: { required: true },
    reader: Meta.Reader.phone,
    generator: Meta.Generator.textinput,
    labels: {"en": "Phone", "nl": "telefoon"}
  });

  var food = {};
  food["nl"] = { 'O': 'Ontbijt', 'L': 'Middageten', 'D': 'Avondmaal'};
  food["en"] = { 'B': 'Breakfast', 'L': 'Lunch', 'D': 'Dinner'};

  X.add({name: "food",
    options: { choices: food },
    reader: Meta.Reader.multiple,
    generator: Meta.Generator.checkboxinput,
    labels: {"en": "Food", "nl": "Eten"}
  });


  // add some custom meta definition, including error custom message
  Meta.Messages.kBadName = 1001;
  Meta.Messages.addMessage("nl", Meta.Messages.kBadName, "Slechte name");
  Meta.Messages.addMessage("en", Meta.Messages.kBadName, "Bad name");


  X.add({
    name: "name",
    options: {},
    reader: Meta.Reader.makeReader(function nameReader(value, object) {
      if ((typeof value != undefined) && (value.indexOf("Cody") > 0)) {
        return "Cody is a good name";
      } else {
        object.error = Meta.Messages.kBadName;
        return "Super Cody";
      }
    }),
    generator: Meta.Generator.textinput,
    labels: { "en": "Best CMS", "nl": "Beste CMS ooit"}
  });

  var JJ = JSON.stringify(X);
  console.log("save meta = ");
  console.log(JJ);

  var X = new Meta(JSON.parse(JJ));

  var P = {"width": "10", "red": "122", "blue": "333", "name": "nobody", "sex": "F", "born_dd": "30", "born_mm": "4", "born_yyyy": "1962"};
  console.log("Params = ");console.log(P);

  X.readValuesFrom(P, false);
  console.log("Values original = ");console.log(X.values());

  X.reset();
  X.readValuesFrom(P, true);
  console.log("Values corrected = ");console.log(X.values());

  console.log("Errors = ");console.log(X.errors());
  console.log("HTML = ");console.log(X.html());

  P = {"width": "10", "phony": "050W335066", "red": "111", "green": "121", "blue": "222", "name": "Cody CMS", "sex": "F", "sexy": "F", "food_L": "L", "food_D": "D", "email": "johan577@mac.com"};
  X.reset();

  console.log("HTML empty = "); console.log(X.html("nl"));

  X.reset();
  X.readValuesFrom(P, true);
  console.log("Params = ");console.log(P);
  console.log("Values = ");console.log(X.values());
  console.log("Errors = ");console.log(X.errors("nl"));
  console.log("NL - HTML with values = ");console.log(X.html("nl"));
  console.log("EN - HTML with values = ");console.log(X.html("en"));
}

if (module.id === ".") {
  demo();
}

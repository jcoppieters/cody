//
// Johan Coppieters - may 2013 - cody
//
//
console.log("loading " + module.id);

var cody = require("../index.js");


function Content(basis, app) {
  // copy from basis
  for (var a in basis) {
    if (basis.hasOwnProperty(a)) {
      this[a] = basis[a];
    }
  }
  this.intro = this.intro || "N";
  this.name = this.name || "";
  this.data = this.data || "";
  this.kind = this.kind || "T";
  this.sortorder = this.sortorder || 10;
  this.atom = this.atom || 0;

  this.getAtom(this.atom, app);
}

module.exports = Content;

Content.kindName = function(theKind) {
  return (theKind === "I") ? "Image" :
         (theKind === "T") ? "Text" :
         (theKind === "M") ? "Form" :
         (theKind === "P") ? "Params" :
         (theKind === "S") ? "String" :
         (theKind === "F") ? "File" :
         "Block";
};

Content.prototype.attachTo = function(obj, itemId, language) {
  this.page = obj;
  this.language = language;
  this.itemId = itemId;
}


Content.prototype.getAtom = function(atomId, app) {
  this.atomId = atomId;
  this.atom = (atomId > 0) ? app.getAtom(atomId) : undefined;
};
Content.prototype.contentLength = function() {
  return (this.data) ? this.data.length : 0;
};
Content.prototype.isIntro = function() {
  return (this.intro === "Y");
};


Content.prototype.renderText = function(controller) {
  return this.data;
};

Content.prototype.renderParams = function(controller) {
  // these values should already be in the current context
  return "<!-- page params " + this.data + " -->";
}

Content.prototype.renderForm = function(controller) {
  var form;
  if ((typeof controller.context.errorForms !== "undefined") &&
      (typeof controller.context.errorForms[this.atomId] !== "undefined")) {
    // check if we have a stored form, filled with values and errors...
    form = controller.context.errorForms[this.atomId];

  } else {
    form = cody.FormController.makeMeta(this.atom);
  }

  var formInfo = cody.FormController.makeFormInfo(this.atom, controller.context.page);

  return form.html(this.language, formInfo);
};

Content.prototype.renderFacebook = function(controller) {
  var url = this.data.replace("[page]", controller.context.page.getURL(this.language));
  if (url === "") url = controller.context.page.getURL(this.language);
  if (url.indexOf("http") < 0) { url = "http://" + url; }

  return '<div class="fb-like" data-href="' + url + '" data-send="false" data-layout="button_count" data-width="100" data-show-faces="false"></div>' +
    '<div id="fb-root"></div>' +
    '<script>(function(d, s, id) {' +
    ' var js, fjs = d.getElementsByTagName(s)[0];' +
    ' if (d.getElementById(id)) return;' +
    ' js = d.createElement(s); js.id = id;' +
    ' js.src = "http://connect.facebook.net/en_US/all.js#xfbml=1";' +
    ' fjs.parentNode.insertBefore(js, fjs);' +
    '}(document, "script", "facebook-jssdk"));</script>';
};

Content.prototype.renderShare = function(controller) {
  var url = this.data.replace("[page]", controller.context.page.getURL(this.language));
  if (url === "") url = controller.context.page.getURL(this.language);
  if (url.indexOf("http") < 0) { url = "http://" + url; }

  return '<div class="fb-share-button" data-href="http://zzz.yyy.xx" data-layout="button"></div>' +
      '<div id="fb-root"></div>' +
      '<script>(function(d, s, id) {' +
      ' var js, fjs = d.getElementsByTagName(s)[0];' +
      ' if (d.getElementById(id)) return;' +
      ' js = d.createElement(s); js.id = id;' +
      ' js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.0";' +
      ' fjs.parentNode.insertBefore(js, fjs);' +
      '}(document, "script", "facebook-jssdk"));</script>';
};

Content.prototype.renderImage = function(controller) {
  if (this.atom && (typeof this.atom != "undefined")) {
    return "<img src='" + controller.context.dynamic + "/images/" + this.atom.id + "." + this.atom.extention + "'>";
  } else {
    return "<!-- missing atom for " + this.id + " -->";
  }
};

Content.prototype.renderFile = function(controller) {
  if (this.atom && (typeof this.atom != "undefined")) {
    return "<a href='" + controller.context.dynamic + "/files/" + this.atom.id + "." + this.atom.extention + "'><img class='icon' src='" + controller.context.cstatic + "/extentions/" + this.atom.extention + ".png'/></a>" +
           "<a href='" + controller.context.dynamic + "/files/" + this.atom.id + "." + this.atom.extention + "' class='filelink'>" + this.atom.note + "</a>";
  } else {
    return "<!-- missing atom for " + this.id + " -->";
  }
};


Content.prototype.render = function(controller) {
  if (this.kind === "T") {
    return this.renderText(controller);
    
  } else if (this.kind === "S") {
    return this.renderText(controller);

  } else if (this.kind === "M") {
    return this.renderForm(controller);

  } else if (this.kind === "B") {
    return this.renderFacebook(controller);

  } else if (this.kind === "H") {
    return this.renderShare(controller);

  } else if (this.kind === "I") {
    return this.renderImage(controller);

  } else if (this.kind === "F") {
    return this.renderFile(controller);

  } else if (this.kind === "P") {
    return this.renderParams(controller);

  } else {
    return controller.render(this);

  }
};


Content.prototype.scrapeFrom = function(controller) {
  this.name = controller.getParam("name", "");
  this.intro = controller.getParam("intro", "N");
  this.atom = controller.getParam("atom", 0);
    this.getAtom(this.atom, controller.app);
  this.data = controller.getParam("data", "");
  this.kind = controller.getParam("kind", "T");
  this.sortorder = controller.getParam("sortorder", 10);
};

Content.prototype.scrapeFromWithId = function(controller) {
  this.name = controller.getParam("name_"+this.id, this.name);
  this.intro = controller.getParam("intro_"+this.id, "N");
  this.atom = controller.getParam("atom_"+this.id, 0);
    this.getAtom(this.atom, controller.app);
  this.data = controller.getParam("data_"+this.id, "");
  this.kind = controller.getParam("kind_"+this.id, "T");
  this.sortorder = controller.getParam("sortorder_"+this.id, 10);
};

Content.prototype.doDelete = function(controller, finish) {
  var self = this;
  
  controller.query("delete from content where id = ?", [self.id], function(err, result){
    if (err) { 
      console.log("Content.doDelete -> error deleting content, id = " + self.id + " of " + self.language + "/" + self.itemId);
      console.log(err); 
    } else {
      console.log("Content.doDelete -> deleted content, id = " + this.id + " of " + self.language + "/" + self.itemId);
    }
    if (typeof finish === "function") { finish(); }
  });
};


Content.prototype.doUpdate = function(controller, isNew, finish) {
  var self = this;
  var values = [self.itemId, self.language, self.sortorder, self.intro, self.kind , self.atomId, self.name, self.data];
  
  // new or existing record?
  if (isNew) {
    // console.log("Content.doUpdate -> insert content " + self.name);
    controller.query("insert into content (item, language, sortorder, intro, kind , atom, name, data) " +
                     "values (?, ?, ?, ?, ?, ?, ?, ?)", values,
      function(err, result) {
        if (err) { 
          console.log("Content.doUpdate -> error inserting content for: " + self.language + "/" + self.itemId);
          console.log(err); 
        } else {
          self.id = result.insertId;
          console.log("Content.doUpdate -> inserted content: " + self.id + ", order: " + self.sortorder + ", for: " + self.language + "/" + self.itemId);
          if (typeof finish === "function") { finish(); }
        }
    });
    
  } else {
    //console.log("Content.doUpdate -> update content: " + self.id + ", for: " + self.itemId + " - " + self.kind);
    values.push(this.id);
    controller.query("update content set item=?, language=?, sortorder=?, intro=?, kind=? , atom=?, name=?, data=? " +
                     " where id = ?", values,
        function(err) {
          if (err) { 
            console.log("Content.doUpdate -> error updating content: " + self.id + ", for: " + self.language + "/" + self.itemId);
            console.log(err); 
          } else {
            console.log("Content.doUpdate -> updated content: " + self.id + ", order: " + self.sortorder + ", for: " + self.language + "/" + self.itemId);
            self.updated = new Date();
            if (typeof finish === "function") { finish(); }
          }
    });
  }

};

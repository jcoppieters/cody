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

/* SQL tables

drop table tags;
create table tags (
 id char(16) not null primary key,
 name varchar(63)
 );
insert into tags values ('jsconf', 'jsconf.be'), ('stage', 'Stage'), ('cody', 'Cody'), ('ITmgrs', 'ICT Mgrs');

drop table contacts;
create table contacts (
 id int(11) not null primary key auto_increment,
 company varchar(127) default '',
 name varchar(127) default '',
 title varchar(32) default '',
 street varchar(127) default '',
 zipcity varchar(127) default '',
 country varchar(64) default '',
 email varchar(127) default '',
 phone varchar(32) default '',
 phone2 varchar(32) default '',
 origin varchar(32) default '',
 tags varchar(255) default '',
 active char(1) default 'Y',
 note varchar(2048) default '',
 nomail char(1) default 'N',
 data text
);

 */
console.log("loading " + module.id);

var cody = require("cody/index.js");



function ContactController(context) {
  console.log("ContactController.constructor -> page(" + context.page.itemId + ") = " + context.page.title + ", request = " + context.request);

  // make a contact model and attach to controller
  var myModel = new cody.Model(this, {
    tableName: "contacts",
    id: {name: "id", def: 0},
    cols: [
      {name: "name",   label: "Name",        def: "",  list: true,  sort: "asc", q: "like"},
      {name: "company",label: "Company",     def: "",  list: true,  q: "like" },
      {name: "title",  label: "Title",       def: "",  list: false},
      {name: "street", label: "Street",      def: "",  list: false},
      {name: "zipcity",label: "Zip City",    def: "",  list: false},
      {name: "country",label: "Country",     def: "",  list: false},
      {name: "tags",   label: "Tags",        def: "",  list: false, q: "like"},
      {name: "email",  label: "Email",       def: "",  list: true,  q: "like"},
      {name: "data",   label: "JSON Data",   def: "{}",list: false},
      {name: "phone",  label: "Phone 1",     def: "",  list: true},
      {name: "phone2", label: "Phone 2",     def: "",  list: true,  hide: true},
      {name: "origin", label: "Origin",      def: "",  list: false},
      {name: "note",   label: "Note",        def: "",  list: false},
      {name: "active", label: "Active",      def: "Y", list: true,  hide: true},
      {name: "nomail", label: "Allows Mail", def: "Y", list: true,  hide: true}]
  });

  this.model.addRef("tags", "select id, name from tags order by name");
  this.model.addRef("atoms", "select id, name from atoms where parent = 3 order by name");

  context.model = myModel;

	// init inherited controller
	cody.Controller.call(this, context);
}

ContactController.prototype = Object.create( cody.Controller.prototype );
module.exports = ContactController;



ContactController.prototype.doRequest = function( finish ) {
  var self = this;

  self.getDetailData();

  if (this.doCrudRequest(finish)) {
    // handled by std controller

  } else if (this.isRequest("sendmail")) {
    self.doMails(function() {
      self.model.doList( finish );
    });

  } else if (this.isRequest("testmail")) {
    self.doTestMail(function() {
      self.model.doList( finish );
    });

  } else if (this.isRequest("import")) {
    self.doImportFormData(self.context.atom, self.context.status, function() {
      self.model.doList( finish );
    });

  } else {
    cody.Controller.prototype.doRequest.call(self, finish);

  }
};


ContactController.prototype.getDetailData = function() {
  var self = this;

  // search params
  self.context.q_name = self.updateSession("q_name", "");
  self.context.q_company = self.updateSession("q_company", "");
  self.context.q_tags = self.updateSession("q_tags", "");
  self.context.q_email = self.updateSession("q_email", "");

  // current status and form id
  self.context.status = self.updateSession("status", "N");
  self.context.atom = self.updateSession("atom", 0);

  // get mail data
  self.context.subject = this.updateSession("subject", "");
  self.context.content = this.updateSession("content", "");
  self.context.testmail = this.updateSession("testmail", "");
  self.context.testname = this.updateSession("testname", "");

  self.context.tagCheckboxes = function(name, selected) {
    var html = "";
    var nr = 0;
    for (var iT in this.tags) {
      var tag = this.tags[iT];
      html += '<input name="' + name + '" id="tag' + nr + '" type="checkbox" value="' + tag.id + '" ' +  this.checked(selected.indexOf(tag.id)>=0) + ' /><label for="tag' + nr + '">' + tag.name + '</label>';
      nr++;
    }
    return html;
  }
};


ContactController.prototype.doImportFormData = function (atomId, status, finished) {
  // formdata sits in the "data" table, having
  // id, atom, data(json), status(N/T/D/A), created, modified
  //
  // we'll copy the "created" date, put the name of the atom in "source"
  // we set the active = 'Y', nomail = 'N'
  // from the JSON data we'll try to extract:  name, company(cie), title, tags, email, phone(phone1,telephone), phone2
  //  note(remark), street, zipcity(city), country
  // we'll store the rest of the JSON string in the "data" field.

  function ffield(obj, nameArr) {
    var val = "";
    nameArr.forEach(function(el) {
      if (typeof obj[el] !== "undefined") {
        if (val === "") val = obj[el];
        delete obj[el]; // side effect... delete the field
      }
      var El = el.charAt(0).toUpperCase() + el.slice(1);
      if (typeof obj[El] !== "undefined") {
        if (val === "") val = obj[El];
        delete obj[El]; // side effect... delete the field
      }
    });
    return val;
  }
  var self = this;
  var atom = self.app.getAtom(atomId);
  var tags = self.getParam("tags");
  if (Array.isArray(tags)) tags = tags.join(",");

  self.query("select data, status, created from data where atom = ? and status = ?", [atomId, status], function(err, results) {
    if (err) {
      console.log("error selecting data with status="+ status + " and atom=" + atomId + " -> " + err);
      self.feedBack(false, "Error fetching data from the forms");
      finished();

    } else {
      console.log("importing " + results.length + " records.");
      cody.Application.each(results, function(done) {
        console.log("using data: " + this.data);
        var json = JSON.parse(this.data);
        var arr = [ffield(json, ["cie", "company"]),
                   ffield(json, ["name"]),
                   ffield(json, ["title"]),
                   ffield(json, ["street"]),
                   ffield(json, ["zipcity", "zipCity", "city"]),
                   ffield(json, ["country"]),
                   ffield(json, ["mail", "email"]),
                   ffield(json, ["phone", "telephone", "phone1", "mobile", "gsm"]),
                   ffield(json, ["phone2", "home"]),
                   atom.name,
                   tags,
                   "Y",
                   ffield(json, ["note","remark"]),
                   "N",
                   JSON.stringify(json)];
        console.log(arr);
        self.query("insert into contacts " +
          "(company, name, title, street, zipcity, country, email, phone, phone2, origin, tags, active, note, nomail, data) " +
          "values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", arr, done);

      }, function(err) {
        if (err) {
          console.log("error inserting data -> " + err);
          self.feedBack(false, "Error inserting data");
        } else {
          self.feedBack(true, results.length + " records added");
        }

        finished();
      });
      for (var iRec in results) {
        var rec = results[iRec];

      }
    }
  });
}


ContactController.prototype.doTestMail = function (finished) {
  var pSubject = this.getParam("subject", "testing");
  var pName = this.getParam("testname", "testname");
  var email = this.getParam("testmail", "testing@cody-cms.org");
  var pFrom = this.app.mailFrom;
  var pText = this.getParam("content","cody-cms.org testing");
  //self.sendMail (pFrom, C.email, pSubject, pText);
  console.log ("mailto: from=" + pFrom + ", to=" + pName + " - " + email + " - " +  pSubject + " - " +  pText);
}

ContactController.prototype.doMails = function (finished) {
  this.sendTargetMails(finished, this.getParam("q_tags", ""),
                                 this.app.mailFrom,
                                 this.getParam("subject", "testing"),
                                 this.getParam("content","cody-cms.org testing"));
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
        console.log ("mailto: from=" + pFrom + ", to=" + C.name + " - " + C.email + " - " +  pSubject + " - " +  pText);
      }
    }
    finished();
  });

};
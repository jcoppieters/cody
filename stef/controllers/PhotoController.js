//
// Johan Coppieters - apr 2014
//   first version for website StefDekien.be
//
//
console.log("loading " + module.id);

var mysql = require("mysql");
var fs = require("fs");
var cody = require("../../cody/index.js");

/*
create table photos(
 id int(11) not null unique key auto_increment,
 at datetime,
 title varchar(64) default 'new photo',
 ext varchar(8) default '',
 note varchar(2048) default ''
);

 */

function PhotoController(context) {
  console.log("PhotoController constructor");

  var myModel = new cody.Model(this, {
    tableName: "photos",
    id: {name: "id", def: 0},
    cols: [
      {name: "at", def: new Date(), list: true, sort: "desc"},
      {name: "title", def: "", list: true, q: "like"},
      {name: "note", def: "", list: true},
      {name: "ext", def: "", list: true}]
  });

  // override the standard doSave method to also save the filee
  myModel.doSave = function (finish) {
    cody.Model.prototype.doSave.call(myModel, function() {
      myModel.controller.saveFile(finish);
    });
  };

  // override the standard doDelete method to also delete the file physically
  myModel.doDelete = function (theId, finish) {
    myModel.controller.deleteFile(theId, function() {
      cody.Model.prototype.doDelete.call(myModel, theId, finish);
    });
  };

	// init inherited controller
	cody.Controller.call(this, context);
}

// get us a prototype object
PhotoController.prototype = Object.create( cody.Controller.prototype );

// export our constructor
module.exports = PhotoController;


// we get this function whenever Cody thinks we're responsible for handling the http request
PhotoController.prototype.doRequest = function( finish ) {

  if (! this.doCrudRequest(finish)) {
    cody.Controller.prototype.doRequest.call(this, finish);
  }

}

PhotoController.prototype.getPathName = function(fn) {
  return this.app.getDataPath() + "/photos/" + fn;
}


PhotoController.prototype.deleteFile = function( theId, finish ) {
  var self = this;

  // console.log("PhotoController.deleteFile: photo = " + theId );

  self.query("select ext from photos where id = ?", [theId], function(err, result) {
    if (err) {
      console.log(err);
      self.feedBack(false, "Error deleting the phote, unable to fetch the record");
      finish();
    } else {
      var path = self.getPathName(theId + "." + result[0].ext);
      fs.unlink(path, function (err) {
        if (err) {
          console.log(err);
          self.feedBack(false, "Error deleting the photo, unable to fetch the record");
        }
        finish();
      });
    }
  });
}


//TODO: integrate this into a configurable behaviour of the cody.Controller base class

PhotoController.prototype.saveFile = function( finish ) {
  var self = this;
  var id = self.model.id.val;

  // console.log("PhotoController.saveFile: photo = " + id );
  
  if (id !== self.model.id.def) {
    var F = self.context.req.files;

    // the file input type is named "fileToUpload"
    if ((typeof F !== "undefined") && (typeof F.fileToUpload !== "undefined")) {
      F = F.fileToUpload;

      if (F.size !== 0) {
        // find the name of the file
        var dot = F.name.lastIndexOf(".");
        var ext = F.name.substring(dot+1);
        var newPath = self.getPathName(id + "." + ext);

        // move the tmp file to our own datastore
        // console.log("PhotoController.saveFile: moving file from " + F.path + " to " + newPath);
        fs.rename(F.path, newPath, function(err) {
          if (err) {
            console.log(err);
            self.feedBack(false, "unable to rename uploaded photo to " + newPath);
          } else {
            // console.log("updating extention to " + ext + " of id = " + id);
            self.query("update photos set ext = ? where id = ?", [ext, id], finish);
          }
        });
      } else {
        // just delete the tmp file if it's empty
        fs.unlink(F.path, function() {
          self.query("update photos set ext = '' where id = ?", [id], finish);
        });
      }

    } else {
      // console.log("PhotoController.saveFile: no photo attached.");
      self.query("update photos set ext = '' where id = ?", [id], finish);
    }

  } else {
    self.feedBack(false, "failed to save the photo - no record found to attach to it.");
    finish();
  }
};

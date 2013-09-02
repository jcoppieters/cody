//
// Johan Coppieters - jan 2013 - jWorks
//
//
console.log("loading " + module.id);

var libpath = require("path"),
    http = require("http"),
    fs = require("fs"),
    url = require("url"),
    mime = require("mime"),
    cody = require("../index.js");
 

function Dynamic(req, res, path) {
  this.request = req;
  this.response = res;
  this.path = path;
}

module.exports = Dynamic;


Dynamic.prototype.serve = function () {
  var self = this;

  var uri = url.parse(self.request.url).pathname;
  uri = uri.replace("data/","");
  var filename = this.path + "/" + ((uri.indexOf("/") === 0) ? uri.substring(1) : uri);
  

  // check if this file exists
  fs.exists(filename, function (exists) {
      if (!exists) {
        console.log("Dynamic.serve -> file not found: " + filename);
        self.response.writeHead(404, { "Content-Type": "text/plain" });
        self.response.write("404 Not Found\n");
        self.response.end();
        return;
      }

      fs.readFile(filename, "binary", function (err, file) {
        if (err) {
          console.log("Dynamic.serve -> error reading: " + filename + " - " + err);
          self.response.writeHead(500, { "Content-Type": "text/plain" });
          self.response.write(err + "\n");
          self.response.end();
          return;
        }

        var type = mime.lookup(filename);
        console.log("Dynamic.serve -> reading: " + filename + " - " + file.length + " bytes as " + type);
        self.response.writeHead(200, { "Content-Type": type });
        self.response.write(file, "binary");
        self.response.end();
      });
  });
};

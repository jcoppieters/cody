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

var maxCacheAge = 600;  // 10 minutes  ???


function generate404(resp) {
  resp.writeHead(404, { "Content-Type": "text/plain" });
  resp.write("404 Not Found\n");
  resp.end();
}

function Dynamic(req, res, path) {
  this.request = req;
  this.response = res;
  this.path = path;
}

module.exports = Dynamic;


Dynamic.prototype.serve = function () {
  var self = this;
  var uri = url.parse(self.request.url).pathname;

  var ip = self.request.headers['x-forwarded-for'] ||
    self.request.connection.remoteAddress ||
    self.request.socket.remoteAddress ||
    self.request.connection.socket.remoteAddress;
  console.log("--LOG--D--|" + ip + "|" + new Date() + "|" + self.request.headers['host'] + "|" + self.request._parsedUrl.pathname);

  uri = uri.replace("data/", "");
  var filename = libpath.normalize(libpath.join(this.path, uri));

  // check for malicious paths -- thanks to Tom Hunkapiller
  if (filename.indexOf(this.path) !== 0) {
    console.log("Dynamic.serve -> malicious path: " + uri);
    generate404(self.response);
    return;
  }


  // check if this file exists
  fs.exists(filename, function (exists) {
      if (!exists) {
        console.log("Dynamic.serve -> file not found: " + filename);
        generate404(self.response);
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
        self.response.writeHead(200, {
          "Content-Type": type,
          "Cache-Control": "public, max-age=" + maxCacheAge
        });
        self.response.write(file, "binary");
        self.response.end();
      });
  });
};

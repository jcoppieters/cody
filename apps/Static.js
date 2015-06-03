//
// Johan Coppieters - jan 2013 - jWorks
//
//
console.log("loading " + module.id);

var libpath = require("path"),
    http = require("http"),
    fs = require("fs"),
    url = require("url"),
    mime = require("mime");
 
var path = ".";

var cache = {},
    nrCache = 0,
    maxCache = 1, //1 is good for developement -> 30 seems to be reasonable for small websites.
    maxCacheAge = 86400;


function Static(req, res, appFolder) {
  this.request = req;
  this.response = res;
  this.appFolder = appFolder;

  //TODO: we need to have a cache per application
  // - the cody static cache should be high (100?)
  // - other application could be very small (10? 20?)

  //if (typeof cacheSize !== "undefined") {
  //  cache[appFolder].maxCache = cacheSize;
  //}
}
module.exports = Static;


Static.prototype.dump = function () {
  this.response.writeHead(200, { "Content-Type": "text/plain" });
  this.response.write("Cache dump\n----------\n");
  var cnt = 0;
  for (var c in cache) {
    if (cache.hasOwnProperty(c)) {
      this.response.write(c + ": " + cache[c].length + " bytes\n");
      cnt += cache[c].length;
    }
  }
  this.response.write("---------------------------\n");
  this.response.write("Total bytes cached: " + cnt + " bytes\n");
  this.response.write("---------------------------\n");
  this.response.end();
};

Static.prototype.addCache = function (filename, file) {
  if (nrCache >= maxCache) {
    // should be sorted on number of uses
    var nr = Math.floor(Math.random() * maxCache) + 1;
    for (var c in cache) {
      if (cache.hasOwnProperty(c)) {
        nr--;
        if (nr === 0) {
          delete cache[c];
          nrCache--;
          // console.log("static -> deleted from cache: " + c);
          break;
        }
      }
    }
  }
  cache[filename] = file;
  nrCache++;
  // console.log("Static -> added to cache: " + filename);
};


Static.prototype.tryCache = function (filename) {
  var file = cache[filename];
  if (file) {
    // add 1 to nr of uses
    var type = mime.lookup(filename);
    console.log("Static.serve -> cache hit: " + filename + " - " + file.length + " bytes as " + type);
    this.response.writeHead(200, {
      "Content-Type": type,
      "Cache-Control": "public, max-age=" + maxCacheAge // thanks Aselbie
    });
    this.response.write(file, "binary");
    this.response.end();
    return true;
  }
  return false;
};


Static.prototype.serve = function () {
  var self = this;
  var uri = url.parse(self.request.url).pathname;

  var ip = self.request.headers['x-forwarded-for'] ||
    self.request.connection.remoteAddress ||
    self.request.socket.remoteAddress ||
    self.request.connection.socket.remoteAddress;
  console.log("--LOG--S--|" + ip + "|" + new Date() + "|" + self.request.headers['host'] + "|" + self.request._parsedUrl.pathname);

  var filename;

  // JM: module.parent = the invoking cody; its parent is the running
  // web app's module (user code).
  // note that path.resolve confuses the filename at the end of the
  // module path with a directory, so we need extra .. to refer to
  // the directory it is in.
  if (self.appFolder != "") {
    filename = libpath.resolve(module.parent.parent.filename, "..", self.appFolder, uri.substring(1));
  }
  else
  {
    //JM: requested a file from cody's static files.
    //the first part of the uri must be "/cody" (or actually we compare with
    //the current cody module's package's directory name).
    if(uri.indexOf("/" + libpath.basename(libpath.resolve(module.parent.filename, "..")) + "/") == 0)
    {
	filename = libpath.resolve(module.parent.filename, '..', uri.substring(libpath.basename(libpath.resolve(module.parent.filename, "..")).length + 2));
    }
    else
    {
	console.log("Invalid URI: " + uri);
	return;
    }
  }

  // should be moved to a SystemController
  if (filename === "static/_") {
    this.dump();
    return;
  }
    
  // try serving from cache
  if (self.tryCache(filename)) {
    return;
  }
  
  // check if this file exists
  fs.exists(filename, function (exists) {
      if (!exists) {
        console.log("Static.server -> file not found: " + filename);
        self.response.writeHead(404, { "Content-Type": "text/plain" });
        self.response.write("404 Not Found\n");
        self.response.end();
        return;
      }

      if (fs.statSync(filename).isDirectory()) {
        filename += '/index.html';
      }

      fs.readFile(filename, "binary", function (err, file) {
        if (err) {
          console.log("Static.serve -> error reading: " + filename + " - " + err);
          self.response.writeHead(500, { "Content-Type": "text/plain" });
          self.response.write(err + "\n");
          self.response.end();
          return;
        }

        var type = mime.lookup(filename);
        console.log("Static.serve -> sending: " + filename + " - " + file.length + " bytes as " + type);
        self.response.writeHead(200, {
          "Content-Type": type,
          "Cache-Control": "public, max-age=" + maxCacheAge
        });
        self.response.write(file, "binary");
        self.response.end();
        
        self.addCache(filename, file);
      });
  });
};

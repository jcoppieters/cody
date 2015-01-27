var readline = require("readline");
var util     = require("util");
var fs       = require("fs");
var mysql    = require("mysql");
var path     = require("path");

var rootwd = process.cwd();
var codywd = rootwd + "/node_modules/cody";


// https://gist.github.com/tkihira/3014700
var mkdir = function (dir) {
  // making directory without exception if exists
  try {
    fs.mkdirSync(dir, 0755);
  } catch (e) {
    if (e.code !== "EEXIST") {
      throw e;
    }
  }
};

var copyDir = function (src, dest) {
  mkdir(dest);
  var files = fs.readdirSync(src);
  var i;
  for (i = 0; i < files.length; i++) {
    var current = fs.lstatSync(path.join(src, files[i]));
    if(current.isDirectory()) {
      copyDir(path.join(src, files[i]), path.join(dest, files[i]));
    } else if(current.isSymbolicLink()) {
      var symlink = fs.readlinkSync(path.join(src, files[i]));
      fs.symlinkSync(symlink, path.join(dest, files[i]));
    } else {
      copy(path.join(src, files[i]), path.join(dest, files[i]));
    }
  }
};

var copy = function (src, dest) {
  var oldFile = fs.createReadStream(src);
  var newFile = fs.createWriteStream(dest);
  util.pump(oldFile, newFile);
};

/**
 * Look ma, it's cp -R.
 * @param {string} src The path to the thing to copy.
 * @param {string} dest The path to the new copy.
 */
var copyRecursiveSync = function(src, dest) {
  var exists = fs.existsSync(src);
  var stats = exists && fs.statSync(src);
  var isDirectory = exists && stats.isDirectory();
  if (fs.existsSync(dest)) return;
  if (exists && isDirectory) {
    fs.mkdirSync(dest);
    fs.readdirSync(src).forEach(function(childItemName) {
      copyRecursiveSync(path.join(src, childItemName),
                        path.join(dest, childItemName));
    });
  } else {
    fs.linkSync(src, dest);
  }
};


var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log("Creating cody web tree in ", rootwd);
rl.question("Enter sitename: ", function (sitename) {
  console.log("Note: also using $sitename as database name.");
  console.log("Note: by default the mysql root user has no password so you can just hit enter, if you forgot the root password http://dev.mysql.com/doc/refman/5.0/en/resetting-permissions.html");
  rl.question("2) Enter root password for mysql so we can create a new database and user: ", function (dbrootpw) {
    rl.question("3) Enter site database user: ", function (dbuser) {
      rl.question("4) Enter site database password: ", function (dbpass) {
        rl.question("5) Enter hostname for site: ", function (hostname) {
          var con = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: dbrootpw,
            multipleStatements: true
          });
          con.connect();
          con.query("create database " + sitename + " default charset utf8", function (err) {
            if (err) console.log(err);
            con.query("grant all on " + sitename + ".* to '" + dbuser + "'@'%' identified by '" + dbpass + "'", function (err) {
              if (err) console.log(err);

              con.query("grant all on " + sitename + ".* to '" + dbuser + "'@'localhost' identified by '" + dbpass + "'", function (err) {
                if (err) console.log(err);

              con.end();
              con = mysql.createConnection({
                host: 'localhost',
                user: dbuser,
                database: sitename,
                password: dbpass,
                multipleStatements: true
              });
              con.connect();
                fs.readdirSync(codywd + "/doc/empty").forEach(function (src) {
                  copyRecursiveSync(codywd + "/doc/empty/" + src, path.join(rootwd, src));
                });
                fs.readFile(path.join(rootwd, "empty.sql"), function (err, initstatements) {
                  if (err) throw err;

                  con.query(initstatements.toString(), function (err) {
                    if (err) throw err;

                    fs.writeFileSync(rootwd + "/config.json", JSON.stringify(
                      { name: sitename,
                        mailFrom: "info@"+hostname,
                        hostnames:"localhost,"+hostname,
                        db: sitename,
                        dbuser: dbuser,
                        dbpassword: dbpass,
                        dbhost: "localhost",
                        smtp: "smtpmailer."+hostname,
                        version: "V0.1",
                        defaultlanguage: "en",
                        datapath: "/usr/local/data/"+sitename,
                        port: 3001
                      }));
                   
                    console.log("Site '" + sitename + "' has been prepared.\n")
                    console.log("Please create DNS entries, or add to /etc/hosts:");
                    console.log("127.0.0.1     " + hostname);
                    console.log("Also check index.js and config.json to fine-tune extra parameters, encryption key, ...");
                    console.log("Start your site using:");
                    console.log("forever start index.js");
                    console.log("or");
                    console.log("node index.js");
                    con.end();
                    rl.close();
                  });
                });
              });
            });
          });
        });
      });
    });
  });
});



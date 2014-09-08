//
// Johan Coppieters - mar 2013 - cody
//
//
console.log("loading " + module.id);

var cody = require("./../index.js");


function User(basis) {
  // copy from basis
  for (var a in basis) {
    if (basis.hasOwnProperty(a)) {
      this[a] = basis[a];
    }
  }
  this.id = this.id || 0;
  this.maxbadlogins = this.maxbadlogins || 999;
  this.badlogins = this.badlogins || 0;
  this.level = this.level || 0;
  this.active = this.active || "N";
  this.nomail = this.nomail || "N";
  this.note = this.note || "";
  this.sortorder = this.sortorder || 10;
}

module.exports = User;


//
// Class stuff
//

User.sqlGetUserByPw = "select * from users where username = ? and password = password(?)";
User.sqlGetUserById = "select * from users where id = ?";
User.sqlDeleteUser = "delete from users where id = ?";
User.sqlGetUserList = "select * from users where level <= ? order by name";
User.sqlGetDomainList = "select distinct domain from users order by 1";
User.sqlAddBadLogin = "update users set badlogins = badlogins + 1 where username = ?";
User.sqlClearBadLogins = "update users set badlogins = 0 where username = ?";
User.sqlGetDomainList = "select distinct domain from users order by domain";
User.sqlGetLevelList = "select id, name from levels where id <= ? order by id";


User.getUsers = function(controller, level, store) {
  controller.query(User.sqlGetUserList, [level], function(err, result) {
    if (err) { console.log(err); throw(new Error("User.getUsers failed with sql errors")); }
    store(result);
  });
};

User.getDomains = function(controller, store) {
  controller.query(User.sqlGetDomainList, [], function(err, result) {
    if (err) { console.log(err); throw(new Error("User.getDomains failed with sql errors")); }
    store(result);
  });
};

User.getLevels = function(controller, level, store) {
  controller.query(User.sqlGetLevelList, [level], function(err, result) {
    if (err) { console.log(err); throw(new Error("User.getLevels failed with sql errors")); }
    store(result);
  });
};

User.getUser = function() {
  // either:
  //   getUser(controller, username, password, store)
  // or
  //   getUser(controller, id, store)
  
  var controller = arguments[0];
  var store;
  
  if (arguments.length === 4) {
    store = arguments[3];  
    controller.query(User.sqlGetUserByPw, [arguments[1], arguments[2]], function(error, results) {
      if (error) { console.log(error); throw(new Error("User.getUser failed with sql errors")); }
      store(new User(results[0]));
   });

    
  } else if (arguments.length === 3) {
    store = arguments[2];  
    controller.query(User.sqlGetUserById, [arguments[1]], function(error, results) {
      if (error) { console.log(error); throw(new Error("User.getUser failed with sql errors")); }
      store(new User(results[0]));
    });
  }
};

User.deleteUser = function(controller, id, finish) {
  controller.query(User.sqlDeleteUser, [id], function(error, results) {
    if (error) {  
      console.log("User.deleteUser: error during delete of user with id = " + id); 
      console.log(error); 
    } else {
      console.log("deleted user id = " + id);
    }

    finish(typeof error === "undefined");
  });
};


// 
// instance methods
//

User.prototype.getDomain = function() {
	return this.domain || "";
};

User.prototype.getLevel = function() {
	return this.level || 0;
};

User.prototype.getId = function() {
  return this.id || 0;
};

User.prototype.getSortOrder = function() {
  return this.sortorder || 10;
};

User.prototype.getEmail = function() {
	return this.email || "";
};

User.prototype.isActive = function() {
	return (this.active) ? (this.active === "Y") : false;
};

User.prototype.scrapeFrom = function(controller) {
  this.username = controller.getParam("username", this.username);
  this.password = controller.getParam("password", "");
  this.name = controller.getParam("name", this.name);
  this.domain = controller.getParam("domain", this.domain);
  this.level = controller.getInt("level", this.level);
  this.email = controller.getParam("email", this.email);
  this.note = controller.getParam("note", this.note);
  this.nomail = controller.getParam("nomail", this.nomail);
  this.badlogins = controller.getParam("badlogins", this.badlogins);
  this.maxbadlogins = controller.getParam("maxbadlogins", this.maxbadlogins);
  this.active = controller.getParam("active", this.active);
  this.sortorder = controller.getParam("sortorder", this.sortorder);
};

// not on prototype, no user object exists
User.addBadLogin = function(controller, theUserName, finish) {
  controller.query(User.sqlAddBadLogin, [theUserName], finish);
};

User.prototype.clearBadLogins = function(controller, finish) {
  var self = this;
  
  if (self.badlogins > 0) { 
    controller.query(User.sqlClearBadLogins, [self.username], function(err, result) {
      if (err) { console.log(err); throw(new Error("User.clearBadLogins failed with sql errors")); }
      console.log("Cleared bad logins");
      finish();
    });
  } else { 
    // no need to access the database if there are no badLogins
    finish(); 
  }
};


User.prototype.doUpdate = function(controller, finish) {
  var self = this;
  var values = [self.username, self.name, self.domain, self.level, self.badlogins,
                self.maxbadlogins, self.active, self.email, self.note, self.nomail, self.sortorder];
  
  // new or existing record
  if ((typeof self.id === "undefined") || (self.id === 0)) {

    console.log("insert user " + this.username);
    values.push(self.password);
    controller.query("insert into users (username, name, domain, level, badlogins, maxbadlogins, " +
                     "active, email, note, nomail, sortorder, password) " +
                     "values (?, ?, ?, ?,  ?, ?, ?, ?, ?, ?, ?, password(?))", values,
        function(err, result) {
          if (err) { 
            console.log(err); throw(new Error("User.doUpdate/insert failed with sql errors")); 
          } else {
            self.id = result.insertId;
            console.log("inserted user: " + self.id);
            if (typeof finish === "function") { finish(); }
          }
    });
    
  } else {
    console.log("update user " + self.id + " - " + this.username);
    values.push(self.id);
    controller.query("update users set username = ?, name = ?, domain = ?, level = ?, " +
                     " badlogins = ?, maxbadlogins = ?, active = ?, email = ?, note = ?, nomail = ?, sortorder = ? " +
                     "where id = ?", values,
      function(err) {
        if (err) { 
          console.log(err); throw(new Error("User.doUpdate/update failed with sql errors"));
        } else {
          console.log("updated user: " + self.id);
          if (self.password != "") {
            controller.query("update users set password = password(?) where id = ?", [self.password, self.id], function() {
              if (err) {
                console.log(err); throw(new Error("User.doUpdate/update PW failed with sql errors"));
              }
              console.log("updated password of " + self.id);
              if (typeof finish === "function") {
                finish();
              }
            });
          } else if (typeof finish === "function") {
            finish();
          }
        }
    });
  }
};

User.prototype.doDelete = function(controller, finish) {
  var self = this;
  controller.query(User.sqlDeleteUser, [self.id], function(isOK) {
    if (typeof finish === "function") { finish(isOK); }
  });
};


User.emailExists = function (controller, email, finish) {
 controller.query("SELECT * FROM users WHERE email = ?", [email], function (err, rows) {
   if (err)
     return finish(err);
   finish(undefined, rows.length > 0);
 });
};

User.getByEmail = function (controller, email, finish) {
 controller.query("SELECT * FROM users WHERE email = ?", [email], function (err, rows) {
   if (err) return finish(err);
   if (rows.length > 0) {
     return finish(undefined, new User(rows[0]));
   }
   return finish(undefined, new User());
 });
};

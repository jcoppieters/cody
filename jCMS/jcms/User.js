//
// Johan Coppieters - mar 2013 - jCMS
//
//
console.log("loading " + module.id);

var jcms = require("./index.js");

module.exports = User;


function User(basis) {
  // copy from basis
  for (var a in basis) {
    if (basis.hasOwnProperty(a)) {
      this[a] = basis[a];
    }
  }  
}


// User.sqlGetUser = "select * from users where username = ? and password = password(?)";
User.sqlGetUser = "select * from users where username = ? and password = ?";
User.sqlGetUserList = "select * from users order by name";
User.sqlGetDomainList = "select distinct domain from users order by 1";


User.loadDomains = function(connection, store) {
  connection.query(User.sqlGetDomainList, [], function(err, result) {
    store(result);
  });
};

User.getUser = function(connection, username, password, store) {
  connection.query(User.sqlGetUser, [username, password], function(error, results) {
    store(new User(results[0]));
  });
};

User.prototype.getDomain = function() {
	return this.domain || "";
};

User.prototype.getLevel = function() {
	return this.level || 0;
};

User.prototype.getId = function() {
	return this.id || 0;
};

User.prototype.getEmail = function() {
	return this.email || "";
};

User.prototype.isActive = function() {
	return (this.active) ? (this.active === "Y") : false;
};

User.prototype.doUpdate = function(controller, finish) {
  var self = this;
  var values = [self.username, self.name, self.password, self.domain, self.level, 
                self.badlogins, self.maxbadlogins, self.active, self.email, self.note, self.nr];
  
  // new or existing record
  if ((typeof this.id == "undefined") || (this.id === 0)) {
    
    console.log("insert user " + this.username);
    controller.query("insert into users (username, name, password, domain, level, " +
                     " badlogins, maxbadlogins, active, email, note, nr) " +
                     "values (?, ?, ?, ?, ?,  ?, ?, ?, ?, ?, ?)", values,
        function(err, result) {
          if (err) { 
            console.log(err); 
          } else {
            self.id = result.insertId;
            console.log("inserted user: " + self.id);
            if (typeof finish == "function") { finish.call(self, controller); }
          }
    });
    
  } else {
    console.log("update user " + self.id + " - " + this.username);
    values.push(self.id);
    controller.query("update users set username = ?, name = ?, password = ?, domain = ?, level = ?, " +
                     " badlogins = ?, maxbadlogins = ?, active = ?, email = ?, note = ?, nr = ? " +
                     "where id = ?", values,
      function(err) {
        if (err) { 
          console.log(err); 
        } else {
          console.log("updated user: " + self.id);
          if (typeof finish == "function") { finish.call(self, controller); }
        }
    });
  }
};

User.prototype.doDelete = function(controller, finish) {
  var self = this;
  console.log("delete user " + self.id + " - " + this.username);
  controller.query("delete from users where id = ?", [self.id], function(err) {
    if (err) { 
      console.log(err); 
    } else {
      console.log("deleted user: " + self.id);
      if (typeof finish == "function") { finish.call(self, controller); }
    }
  });
};
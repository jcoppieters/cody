/**
 * Created with JetBrains WebStorm.
 * User: Dieter Beelaert
 * Date: 5/08/13
 * Time: 16:15
 * To change this template use File | Settings | File Templates.
 */

console.log("loading " + module.id );

var mysql = require("mysql");
var cody =  require("../../cody/index.js");
var fs = require("fs");

//sql statements
SocialuserController.sqlGetUsers = "select u.*, ui.info,ui.Street,ui.number,ui.zip,ui.city,ui.userFunction,ui.telephone,ui.since from users u left join user_info ui on ui.id = u.id where u.domain = 'users' order by since";
SocialuserController.sqlGetUserById = "select * from users u left join user_info ui on ui.id = u.id where u.id = ?";
SocialuserController.sqlUpdateUserData = "insert into user_info (id,info,Street,number,zip,city,userFunction,telephone)" +
    " values(?,?,?,?,?,?,?,?) on duplicate key update info = ?, Street = ?,number = ?," +
    " zip = ?,city = ?,userFunction = ?,telephone = ?";
SocialuserController.sqlUpdateUser = "update users set name = ?, email = ? where id = ? ";
SocialuserController.sqlSendMessage = "insert into user_message(user_from,user_to,message,timestamp) values(?,?,?,?)";
SocialuserController.sqlGetMessagesForUser = "select * from user_message um left join users u on um.user_from = u.id where user_to = ? order by timestamp desc limit 0,100";
SocialuserController.sqlGetOutGoingMessagesForUser ="select * from user_message um left join users u on um.user_to = u.id where user_from = ? order by timestamp desc limit 0,100";
SocialuserController.sqlGetMessageById = "select * from user_message um join users u on um.user_from = u.id where messageId = ?";
SocialuserController.sqlGetOutMessageById = "select * from user_message um join users u on um.user_to = u.id where messageId = ?";


function SocialuserController(context) {
    //views
    this.profileview = "../views/userprofile.ejs";
    this.listView = "../views/userlist.ejs";
    this.inboxView = "../views/inbox.ejs";
    this.messageView = "../views/messageview.ejs";

    
   // init inherited controller
    cody.Controller.call(this, context);
}


//inherrit from controller
SocialuserController.prototype = Object.create( cody.Controller.prototype );
module.exports = SocialuserController;

SocialuserController.prototype.doRequest = function(finish){
 var self = this;

    if(self.isRequest("")){
        self.doList(function(){finish(self.listView);});
    }else if(self.isRequest("otherUser")){
        self.doProfile(self.getParam("id"),function(){finish(self.profileview);});
    }else if(self.isRequest("doUpdate")){
       var id = self.getParam("id");
       var name = self.getParam("name");
       var userFunction = self.getParam("Function");
       var info = self.getParam("info");
       var email = self.getParam("email");
       var telephone = self.getParam("telephone");
       var street = self.getParam("street");
       var number = self.getParam("number");
       var zip = self.getParam("zip");
       var city = self.getParam("city");

       self.query(SocialuserController.sqlUpdateUserData,[id,info,street,number,zip,city,userFunction,telephone,info,street,number,zip,city,userFunction,telephone],function(err,res){
          if(err){console.log(err);}
            self.query(SocialuserController.sqlUpdateUser,[name,email,id],function(err,res){
               self.doList(function(){finish(self.listView);});
            });

       });
    } else if(self.isRequest("sendMsg")){
        var msg = self.getParam("message");
        var toId = self.getParam("toId");
        self.query(SocialuserController.sqlSendMessage,[self.context.getLogin().getId(),toId,msg,self.getCurrentDateTime()],function(err,res){
            if(err){console.log(err);}
            self.doList(function(){finish(self.listView);});
        });
    }else if(self.isRequest("viewMessages")){
        var uId = self.context.getLogin().getId();
        self.query(SocialuserController.sqlGetMessagesForUser,[uId],function(err,res){
          if(err){console.log(err);}
          self.context.messages = res;
          self.query(SocialuserController.sqlGetOutGoingMessagesForUser,[uId],function(err,res){
              if(err){console.log(err);}
              self.context.outMessages = res;
              finish(self.inboxView);
            });

        });
    }else if(self.isRequest("viewSingleMessage")){
        var msgId = self.getParam("msgId");
        var inGoing = self.getParam("in");
        if(inGoing === "Y"){
        self.query(SocialuserController.sqlGetMessageById,[msgId],function(err,res){
            if(err){console.log(err);}
            self.context.message = res[0];
            finish(self.messageView);
        });
        }else {
         self.query(SocialuserController.sqlGetOutMessageById,[msgId],function(err,res){
            if(err){console.log(err);}
             self.context.message = res[0];
             finish(self.messageView);
            });
        }
    }
}

SocialuserController.prototype.doList = function(finish){
  var self = this;
  self.query(SocialuserController.sqlGetUsers,[],function(err,res){
      self.context.users = res;
      finish();
  });
}

SocialuserController.prototype.doProfile = function(id,finish){
    var self=this;
    console.log("the id is " + id);
    self.query(SocialuserController.sqlGetUserById,[id],function(err,res){
        if(err){console.log(err);}
        //assigning values here, to replace the nulls with empty strings
        self.context.viewId = id;
        self.context.username = res[0].username;
        self.context.telephone = res[0].telephone || "";
        self.context.name = res[0].name;
        self.context.email = res[0].email;
        self.context.userFunction = res[0].userFunction || "";
        self.context.street = res[0].Street || "";
        self.context.number = res[0].number || "";
        self.context.zip = res[0].zip || "";
        self.context.city = res[0].city || "";
        self.context.info = res[0].info || "";
        self.context.since = res[0].since || "";
        finish();
    });
}

SocialuserController.prototype.getCurrentDateTime = function(){
    var date = new Date();
    var curdateTime = "";
    curdateTime += date.getFullYear() + "-" + (date.getMonth() +1)+ "-" + date.getDate();
    curdateTime += " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    return curdateTime;
}

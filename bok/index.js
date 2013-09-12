var cody = require("../cody");

var bok = require("./controllers");

cody.startWebApp(cody.server, {
  name: "bok",
  datapath: "./bok/data",
  version: "v0.1a1",
  controllers:
      [
          {name:"CalendarController", controller: bok.CalendarController},
          {name: "SocialuserController", controller: bok.SocialuserController}
      ]
});

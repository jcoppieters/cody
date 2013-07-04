var cody = require("../cody/");

var empty = require("./controllers/");

cody.startWebApp(cody.server, {
  name: "empty",
  datapath: "../empty/data",
  version: "v0.1a1",
  controllers: [ ]
});

var cody = require("../cody/");

// var codyweb = require("./controllers/mytest.js");

cody.startWebApp(cody.server, {
  name: "codyweb",
  db: "codyweb",
  datapath: ".",
  version: "v0.1a1",
  controllers: [
    //{name: "MyController", controller: codyweb.MyController},
    //{name: "MyController", controller: codyweb.MyController}
  ]
});

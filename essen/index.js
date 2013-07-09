var cody = require("../cody/");

var essen = require("./controllers/");

cody.startWebApp(cody.server, {
  name: "essen",
  datapath: "./essen/data",
  version: "v0.1a1",
  controllers: [
    {name: "AgendaController", controller: essen.AgendaController},
    {name: "BookingController", controller: essen.BookingController}
  ]
});

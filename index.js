global.__base = __dirname + '/';

module.exports.Application = require("./apps/Application.js");

module.exports.Model = require("./models/Model.js");
module.exports.Atom = require("./models/Atom.js");
module.exports.Item = require("./models/Item.js");
module.exports.Page = require("./models/Page.js");
module.exports.Meta = require("./models/Meta.js");
module.exports.Content = require("./models/Content.js");
module.exports.Template = require("./models/Template.js");
module.exports.User = require("./models/User.js");

module.exports.Path = require("./models/Path.js");
module.exports.Context = require("./models/Context.js");

module.exports.Controller = require("./controllers/Controller.js");
module.exports.ContentController = module.exports.Controller;
module.exports.LoginController = require("./controllers/LoginController.js");
module.exports.UserController = require("./controllers/UserController.js");
// module.exports.ContactController = require("./controllers/ContactController.js");

module.exports.DashboardController = require("./controllers/DashboardController.js");
module.exports.TreeController = require("./controllers/TreeController.js");
module.exports.PageController = require("./controllers/PageController.js");
module.exports.ImageController = require("./controllers/ImageController.js");
module.exports.FileController = require("./controllers/FileController.js");
module.exports.FormController = require("./controllers/FormController.js");
module.exports.StylesController = require("./controllers/StylesController.js");
module.exports.SystemController = require("./controllers/SystemController.js");
module.exports.TemplateController = require("./controllers/TemplateController.js");

module.exports.Static = require("./apps/Static.js");
module.exports.Dynamic = require("./apps/Dynamic.js");

module.exports.startWebApp = require("./startWebApp.js");
module.exports.makeWebApp = require("./makeWebApp.js");

// module.exports.unitTests = require("./tests/");

module.exports.express = require("express");
module.exports.mysql = require("mysql");
module.exports.fs = require("fs");
module.exports.ejs = require("ejs");
module.exports.bodyParser = require("body-parser");
module.exports.expressSession = require("express-session");
module.exports.multer = require("multer");
module.exports.i18n = require("i18n");

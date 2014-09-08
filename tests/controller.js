// do all kinds of test with the Controller functions

var util = require('util');
var Controller = require('../controllers/Controller.js');

module.exports = function(context) {
  var contextS = util.inspect(context, { showHidden: true, depth: 2 });

  var ctl = new Controller(context);

  context.setParam("id1", "id_123");
  var id1S = ctl.getParam("id1", "not found");
  var id1 = ctl.getUNum("id1");
  var res1 = "id1 - getParam = " + id1S + "<br>" + "id1 - getUNum = " + id1;

  context.setParam("id2", "123");
  var id2S = ctl.getParam("id2", "not found");
  var id2 = ctl.getUNum("id2");
  var res2 = "id2 - getParam = " + id2S + "<br>" + "id2 - getUNum = " + id2;

  return res1 + "<br>" +
    res2 + "<hr>" +
    "<h2>Context</h2><pre>" +contextS + "</pre>";
}

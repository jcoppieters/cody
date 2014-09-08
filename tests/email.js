//
// Laurens Ramandt - june 2013 - cody
// This is a NodeUnit test for the EmailController


var EmailContr = require('../controllers/EmailController');
var nodeunit = require('nodeunit');

exports["sendmail"] = function (test) {
    console.log("starting test");
    var theController = new EmailContr.EmailController();
    theController.sendEmail("noreply@ramandt.be", "laurens.ramandt@live.be", "Important message", "This is an important message. If you received it, e-mail is working.");
    test.done();
};

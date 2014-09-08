//
// Laurens Ramandt - june 2013 - cody
//
//

// this class abstracts nodemailer, just in case we would switch from nodemailer to something else
// npm install nodemailer required

var nodemailer = require("nodemailer");
var cody = require("./../index.js");
function EmailController (context) {
    console.log("EmailController construct");
    cody.Controller.call(this, context);
}

EmailController.sendEmail = function (pFrom, pTo, pSubject, pText) {
    console.log("Sending email from " + pFrom + " to " + pTo);

    var mailOptions = {
        from: pFrom, // sender address
        to: pTo, // list of receivers
        subject: pSubject, // Subject line
        html: pText // HTML body
    };

    //TODO: for production, modify this to use /usr/bin/sendmail
    var smtpTransport = nodemailer.createTransport("SMTP", {
        host: "smtp.scarlet.be", //change this to match your server
        secureConnection: false,
        port: 25/*,
         auth: {
         user: "user@domain.com",
         pass: "password"
         }                   */
    });

    smtpTransport.sendMail(mailOptions, function (error, response) {
        if (error) {
            console.log("Error sending mail: " + error);
        } else {
            console.log("Message sent: " + response.message);
        }
    });

};


EmailController.prototype = Object.create( cody.Controller.prototype );
module.exports = EmailController;
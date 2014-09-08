
console.log("loading " + module.id);

var mysql = require("mysql");
var cody = require("./../index.js");
var fs = require("fs");
var path = require("path");
var util = require("util");


module.exports = StylesController;

function StylesController(context) {
    var self = this;

    console.log("StylesController.constructor");
    this.formView = "-/cms/styles.ejs";
    // init inherited controller
    cody.Controller.call(self, context);
}

StylesController.prototype = Object.create( cody.Controller.prototype );

StylesController.prototype.doRequest = function( finish ) {
    var self = this;

    self.context.fn = this.formView;

    var startupPath = path.dirname(require.main.filename);
    var projectPath = path.join(startupPath, self.context.app.name);
    var staticPath = path.join(projectPath, "static");
    var customCSSPath = path.join(staticPath, "css", "user.css");
    var imagesPath = path.join(staticPath, "images");

    var ff=imagesPath+"";

    fs.readFile(customCSSPath, 'utf8', function (err,data) {
        if (err) {
            data = "";
        }
        self.context.css = data;

        if (self.isRequest("")) {
            finish( self.formView );

        } else if (self.isRequest("newlogo")) {
            self.feedBack(true, "logo-updated");
            var uploadedFiles = self.context.req.files;
            if(uploadedFiles.logoFile === undefined){
                self.feedBack(false, "logo-none-selected");
            }   else{
                var file = uploadedFiles.logoFile;
                if(new Array("image/png").indexOf(file.type) < 0){ //TODO: add other formats but convert them
                    self.feedBack(false, "logo-unsupported-format");
                }else{
                    var destinationPath = path.join(imagesPath, "logoMC.png");
                    ins = fs.createReadStream(file.path);
                    ous = fs.createWriteStream(destinationPath);
                    util.pump(ins, ous, function(err) {
                        if(err) {
                            next(err);
                        } else {
                            res.redirect('/en/styles');
                        }
                    });
                    self.feedBack(true, "logo-updated");
                }
            }
            finish( self.formView );
        } else if (self.isRequest("newcss")) {
            var css = self.getParam("css");
            fs.writeFile(customCSSPath, css, function(err) {
                if(err) {
                    self.feedBack(false, "css-update-failed");
                } else {
                    self.feedBack(true, "css-updated");
                }
                self.context.css = css;
                finish( self.formView );
            });

        } else {
            finish();
        }
    });

    return null;
  //cody.TreeController.prototype.doRequest.call(self, finish);
};




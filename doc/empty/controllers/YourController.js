console.log("loading " + module.id);
var cody = require("cody");


function YourController(context) {

    // init inherited Controller
    cody.Controller.call(this, context);
}
YourController.prototype = Object.create(cody.Controller.prototype);


YourController.prototype.doRequest = function( finish ) {
    var self = this;

    // 1) do the necessary model operations

    // 2) return a result:
    //
    // a) render the attached view of this controller
    finish();

    // b) render the view with given path:
    // finish('views/yourview.ejs')

    // c) if you don't want any rendering to be done:
    //  pass an empty string (or set this.context.fn to empty)
    // finish('')

    // d) return json:
    // finish({foo: 'bar'});

    // e) you can let the super controller handle the request
    // cody.Controller.prototype.doRequest.call(self, finish);

    // more...
};

module.exports = YourController;
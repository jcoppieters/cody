
/**
 * Module dependencies.
 */

var express = require('./')
  , app = express()

app.get('/\\d+', function(req, res){
  res.send('digit ' + req.url);
});

app.get('/\\w+', function(req, res){
  res.send('word ' + req.url);
});

app.listen(3000);
console.log('listening on 3000');

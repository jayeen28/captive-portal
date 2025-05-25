// captive-portal.js
const http = require('http');
http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end('<h1>Welcome!</h1><p>Please enter your Facebook URL:</p><form><input></form>');
}).listen(8080);

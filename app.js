// Runs the dashboard server
// Usage: node server.js <BEARER_TOKEN> <SERVER_PORT>

// Sever init
var express = require('express');
var path = require('path');
var consolidate = require('consolidate');
var app = express();
var _ = require('underscore');

require('./rfid_controller');

var RFIDController = require('./rfid_controller').RFIDController;
var rfidController = new RFIDController();

app.engine('handlebars', consolidate.handlebars);
app.set('views', __dirname + '/site');
app.use(express.bodyParser());

var PORT = process.argv[3] || 80;
console.log('PORT', PORT);

app.get('/', function (req, res) {

  app.render('dashboard.html.handlebars', {}, function (err, html) {
    if (err) {
      console.log(err);
      res.send(500, { error: err });
    } else {
      res.set('Content-Type', 'text/html');
      res.set('Cache-Control', 'no-cache');
      res.send(html);
    }
  });
});

function serveDir (dir) {
  app.get(dir + ':file', function (req, res) {
    var file = req.params.file;
    var filePath = path.normalize(__dirname + '/site' + dir + file);
    console.log('Sending file: '+ filePath);
    res.set('Cache-Control', 'no-cache');
    res.sendfile(filePath);
  });
}

serveDir('/assets/css/');
serveDir('/assets/fonts/');
serveDir('/assets/js/');
serveDir('/assets/imgs/');

var server = require('http').createServer(app);

server.listen(PORT);

rfidController.init();

console.log('URL:');
console.log('GET http://localhost:' + PORT);

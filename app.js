// Runs the dashboard server
// Usage: node server.js <BEARER_TOKEN> <SERVER_PORT>

// Sever init
var express = require('express');
var path = require('path');
var consolidate = require('consolidate');
var app = express();
var _ = require('underscore');
var bodyParser = require('body-parser');

var RFIDController = require('./modules/rfid_controller').RFIDController;
var Arduino = require('./modules/arduino_controller').Arduino;

var rfidController = new RFIDController();
var arduino = new Arduino();

app.engine('handlebars', consolidate.handlebars);
app.set('views', __dirname + '/site');
app.use(bodyParser);

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
rfidController.on('card', function(card) {
	console.log("GOT CARD WITH ID %s", card.id);
});


arduino.init();
arduino.on('goalA', function() {
	console.log("GOAL A!");
});

console.log('URL:');
console.log('GET http://localhost:' + PORT);

// Sever init
var http = require('http');
var express = require('express');
var path = require('path');
var consolidate = require('consolidate');
var app = express();
var _ = require('underscore');
var bodyParser = require('body-parser');

var serveDir = function (dir) {
	app.get(dir + ':file', function (req, res) {
		var file = req.params.file;
		var filePath = path.normalize(__dirname + '/site' + dir + file);
		console.log('Sending file: '+ filePath);
		res.set('Cache-Control', 'no-cache');
		res.sendfile(filePath);
	});
}

var Server = function() {
	app.engine('handlebars', consolidate.handlebars);
	app.set('views', __dirname + '../site');
	app.use(bodyParser);

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

	serveDir('/assets/css/');
	serveDir('/assets/fonts/');
	serveDir('/assets/js/');
	serveDir('/assets/imgs/');

}

Server.prototype.init = function(port) {
	this.server = http.createServer(app);
	this.server.listen(port);
	this.port = port;

	console.log("Web server started on port %d", this.port);
}

exports.Server = Server;




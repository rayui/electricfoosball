var events = require('events');
var util = require('util');
var _ = require('underscore');
var keypress = require('keypress');

keypress(process.stdin);

var Tests = function() {

};

Tests.prototype.init = function(rfid, arduino, game, audio) {
	var self = this;

	this.rfid = rfid;
	this.arduino = arduino;
	this.game = game;
	this.audio = audio;

	process.stdin.on('keypress', function (key) {
		self.processKey.apply(self, [key]);
		if (key && key.ctrl && key.name == 'c') process.exit();
	});
}

Tests.prototype.processKey = function(key) {
	switch (key.toLowerCase()) {
		case 'a':
			this.arduino.emitButtonA();
			break;
		case 'd':
			this.arduino.emitButtonB();
			break;
		case 'w':
			this.arduino.emitButtonC();
			break;
		case 'e':
			this.arduino.emitButtonD();
			break;
		case 'r':
			this.rfid.emitCard({id: parseInt(Math.random() * 1000000000000, 10)});	
		case 'k':
			this.arduino.emitGoalA();
			break;
		case 'l':
			this.arduino.emitGoalB();
			break;			
	}
}


exports.Tests = Tests;

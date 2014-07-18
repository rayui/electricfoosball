var DEV_TTY='/dev/ttyUSB0';
var BAUD_RATE=9600;

require('buffertools').extend();
var events = require('events');
var util = require('util');
var _ = require('underscore');
var SerialPort = require('serialport').SerialPort;
var ArduinoParser = require('./arduino_parser').Parser;

var createGoalData = function(side) {
	return {
		side: side,
		time: new Date(Date.now()).toString()
	}
}

var Arduino = function() {

}

util.inherits(Arduino, events.EventEmitter);

Arduino.prototype.init = function(pin) {
	var self = this;

	this.parser = new ArduinoParser();
	this.parser.init(5000);

  this.serial = new SerialPort(DEV_TTY, {
    baudrate: BAUD_RATE
  });
	
	this.serial.on('data', function(data) {
		self.parser.data.call(self.parser, data);
	});
	this.parser.on('goalA', this.emitGoalA.bind(this));
	this.parser.on('goalB', this.emitGoalB.bind(this));
	this.parser.on('buttonA', this.emitButtonA.bind(this));
	this.parser.on('buttonB', this.emitButtonB.bind(this));
	this.parser.on('buttonC', this.emitButtonC.bind(this));
	this.parser.on('buttonD', this.emitButtonD.bind(this));
}

Arduino.prototype.enable = function() {

}

Arduino.prototype.disable = function() {

}

Arduino.prototype.emitGoalA = function() {
	this.emit('goal', createGoalData(0));
}

Arduino.prototype.emitGoalB = function() {
	this.emit('goal', createGoalData(1));
}

Arduino.prototype.emitButtonA = function() {
	this.emit('button', {id: 0});
}

Arduino.prototype.emitButtonB = function() {
	this.emit('button', {id: 1});
}

Arduino.prototype.emitButtonC = function() {
	this.emit('button', {id: 2});
}

Arduino.prototype.emitButtonD = function() {
	this.emit('button', {id: 3});
}

exports.Arduino = Arduino;


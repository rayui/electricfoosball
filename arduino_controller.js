var DEV_TTY='/dev/ttyUSB0';
var BAUD_RATE=9600;

require('buffertools').extend();
var events = require('events');
var util = require('util');
var _ = require('underscore');
var SerialPort = require('serialport').SerialPort;
var ArduinoParser = require('./arduino_parser').Parser;

var Arduino = function() {

}

util.inherits(Arduino, events.EventEmitter);

Arduino.prototype.init = function(pin) {
	var self = this;

	this.parser = new ArduinoParser();
	this.parser.init();

  this.serial = new SerialPort(DEV_TTY, {
    baudrate: BAUD_RATE
  });
	
	this.serial.on('data', function(data) {
		self.parser.data.call(self.parser, data);
	});
	this.parser.on('goalA', this.emitGoal.bind(this));
}

Arduino.prototype.enable = function() {

}

Arduino.prototype.disable = function() {

}

Arduino.prototype.emitGoal = function() {

}

exports.Arduino = Arduino;


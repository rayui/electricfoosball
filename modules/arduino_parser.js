var util = require('util');
var _ = require('underscore');
var SerialParser = require('./serial_parser');
var buffertools = require('buffertools').extend();

var ArduinoParser = function() {

}

util.inherits(ArduinoParser, SerialParser.Parser);

ArduinoParser.prototype.init = function() {
	SerialParser.Parser.prototype.init.apply(this, arguments);
	this.lastMessage = {
		message: "",
		time: 0
	};
};

ArduinoParser.prototype.processMessage = function(message) {
	var message	= message.slice(3, 9);
	this.emit('goalA');
}

ArduinoParser.prototype.debounce = function(message) {
	var now = Date.now();
	if (message.length < 10) {
		return true;
	}
	if (now - this.lastMessage.time < this.debounceTime &&
		message.compare(this.lastMessage.message) === 0)
	{
		this.lastMessage.message = message;
		return true;
	}
	
	this.lastMessage.time = now;
	this.lastMessage.message = message;

	return false;
}

exports.Parser = ArduinoParser;

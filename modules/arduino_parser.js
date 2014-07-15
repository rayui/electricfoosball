var util = require('util');
var _ = require('underscore');
var SerialParser = require('./serial_parser');

var ArduinoParser = function() {

}

util.inherits(ArduinoParser, SerialParser.Parser);

ArduinoParser.prototype.init = function() {
	SerialParser.Parser.prototype.init.apply(this);
};

ArduinoParser.prototype.processMessage = function(message) {
	var message	= message.slice(3, 9);
	this.emit('goalA');
}

exports.Parser = ArduinoParser;

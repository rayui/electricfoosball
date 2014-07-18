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
  var message	= message.slice(3, message.length - 2).toString();
	switch(message) {
	  case 'GOAL_A':
		this.emit('goalA');
		break;
	  case 'GOAL_B':
		this.emit('goalB');
		break;
	  case 'BTN_A':
		this.emit('buttonA');
		break;
	  case 'BTN_B':
		this.emit('buttonB');
		break;
	  case 'BTN_C':
		this.emit('buttonC');
		break;
	  case 'BTN_D':
		this.emit('buttonD');
		break;
	  default:
		console.log("NO EVENT MATCH");
		break;        
  }
}

exports.Parser = ArduinoParser;

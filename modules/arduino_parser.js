var util = require('util');
var _ = require('underscore');
var SerialParser = require('./serial_parser');
var buffertools = require('buffertools').extend();

var lastIndexOf = function(buffer, charBuff) {
	buffer.reverse();
	var i = buffer.indexOf(charBuff);
	buffer.reverse();
	if (i === -1) {
		return -1;
	}
	i = buffer.length - i;
	return i;
}

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
	var messageEnd = lastIndexOf(message, new Buffer([0x00]), 3);
	//message	= message.slice(0, messageEnd).toString();

	switch(message.toString()) {
	  case 'GOAL_A':
		this.emit('goalA');
		break;
	  case 'GOAL_B':
		this.emit('goalB');
		break;
		//intentionally backwards!
		//need to switch the wires for left and right buttons
		// but this is best i can do for now 
	  case 'BTN_B':
		this.emit('buttonA');
		break;
	  case 'BTN_A':
		this.emit('buttonB');
		break;
	  case 'BTN_C':
		this.emit('buttonC');
		break;
	  case 'BTN_D':
		this.emit('buttonD');
		break;
	  default:
		console.log("NO EVENT MATCH FOR %s", message);
		break;        
  }
}

exports.Parser = ArduinoParser;

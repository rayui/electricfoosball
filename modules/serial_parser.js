var MESSAGE_DELIMITER = new Buffer([0x00, 0x00, 0xFF]);

var buffertools = require('buffertools').extend();
var events = require('events');
var util = require('util');
var _ = require('underscore');

var SerialParser = function() {

}

util.inherits(SerialParser, events.EventEmitter);

SerialParser.prototype.init = function(debounceTime) {
	this.stream = new Buffer(0);
	this.deadMansFlag = null;
	this.debounceTime = debounceTime || 50;
};

SerialParser.prototype.data = function(data) {
	var self = this;
	var now = this.deadMansFlag = Date.now();

	this.stream = this.stream.concat(data);

	setTimeout(function() {
		if (now === self.deadMansFlag) {
			self.processMessages.apply(self);
		}
	}, 50);

}

SerialParser.prototype.getNextDelim = function(start) {
	var nextDelim = this.stream.indexOf(MESSAGE_DELIMITER, start + 1);
	return nextDelim >= 0 ? nextDelim : this.stream.length - 1;
}

SerialParser.prototype.processMessages = function() {
	var msgStart = this.stream.indexOf(MESSAGE_DELIMITER, 0) + 3;
	var msgEnd = this.getNextDelim(msgStart);

	//whiel we have messages in the stream
	while (msgStart >= 0) {
		var message = this.stream.slice(msgStart, msgEnd);
		//remove from 0 to end of message from stream

		if (!this.debounce(message)) {
			this.processMessage(message);	
		}

		msgStart = this.stream.indexOf(MESSAGE_DELIMITER, msgEnd);
		msgEnd = this.getNextDelim(msgStart); 
	}

	this.stream = new Buffer(0);
}

SerialParser.prototype.processMessage = function(message) {
	//must be overloaded
	console.log("processMessage must be overloaded!");
}

SerialParser.prototype.debounce = function(message) {
	//can be overloaded
	return false;
}

exports.Parser = SerialParser;

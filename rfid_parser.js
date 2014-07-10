var MESSAGE_DELIMITER = new Buffer([0x00, 0x00, 0xFF]);
var CARD_ID_STRING = new Buffer([0xD5, 0x4B, 0x01]);

require('buffertools').extend();
var events = require('events');
var util = require('util');
var _ = require('underscore');

var RFIDParser = function() {

}

util.inherits(RFIDParser, events.EventEmitter);

RFIDParser.prototype.init = function() {
	this.stream = new Buffer(0);
	this.deadMansFlag = null;
	this.idFlag = false;
};

RFIDParser.prototype.data = function(data) {
	var self = this;
	var now = this.deadMansFlag = Date.now();

	this.stream = this.stream.concat(this.stream, data);

	setTimeout(function() {
		if (now === self.deadMansFlag) {
			self.processMessages.apply(self);
		}
	}, 100);

}

RFIDParser.prototype.getNextDelim = function(start) {
	var nextDelim = this.stream.indexOf(MESSAGE_DELIMITER, start + 1);
	return nextDelim >= 0 ? nextDelim : this.stream.length;
}

RFIDParser.prototype.processMessages = function() {
	var msgStart = this.stream.indexOf(MESSAGE_DELIMITER, 0);
	var msgEnd = this.getNextDelim(msgStart);

	//whiel we have messages in the stream
	while (msgStart >= 0) {

		var message = this.stream.slice(msgStart, msgEnd);
		//remove from 0 to end of message from stream
		
		this.stream = this.stream.slice(msgEnd);
		this.processMessage(message);	

		msgStart = this.stream.indexOf(MESSAGE_DELIMITER);
		msgEnd = this.getNextDelim(msgStart); 
	}

}

RFIDParser.prototype.processMessage = function(message) {
	if(message.indexOf(CARD_ID_STRING) > 4) {
		if (this.idFlag === false) {
			this.idFlag = true;
		} else {
			this.idFlag = false;
			var id = this.readId(message);
			id && this.emit('card', {id: id});
		}
	}
}

RFIDParser.prototype.readId = function(message) {
	var dataStart = 6;
	var cardLength = message.readUInt8(3);
	var id = null;

	if (message.length >= dataStart + cardLength + 1) {
		id = message.slice(dataStart, dataStart + cardLength).toString('hex');
	}

	return id;
}

exports.RFIDParser = RFIDParser;

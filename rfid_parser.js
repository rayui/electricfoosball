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
};

RFIDParser.prototype.data = function(data) {
	var self = this;

	this.stream = this.stream.concat(this.stream, data);
	var msgStart = this.stream.indexOf(MESSAGE_DELIMITER, 0);
	var msgEnd = this.stream.indexOf(MESSAGE_DELIMITER, msgStart + 1);

	//whiel we have messages in the stream
	while (msgStart >= 0 && msgEnd >= 0) {
	
		var message = this.stream.slice(msgStart, msgEnd);
		//remove from 0 to end of message from stream
		
		this.stream = this.stream.slice(msgEnd);
		this.processMessage(message);	
	
		msgStart = this.stream.indexOf(MESSAGE_DELIMITER);
		msgEnd = this.stream.length > 0 ? this.stream.indexOf(MESSAGE_DELIMITER, 1) : -1;
	}

}

RFIDParser.prototype.processMessage = function(message) {
	if(message.indexOf(CARD_ID_STRING) > 0) {
		var id = this.readId();
		this.stream.clear();
		this.emit('card', {id: id});
	}
}

RFIDParser.prototype.readId = function() {
	var cardLength = this.stream.readUInt8(3);
	return this.stream.slice(6, 6 + cardLength).toString('hex');
}

exports.RFIDParser = RFIDParser;

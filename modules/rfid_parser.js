var CARD_ID_STRING = new Buffer([0xD5, 0x4B, 0x01]);

var util = require('util');
var _ = require('underscore');
var SerialParser = require('./serial_parser');

var RFIDParser = function() {

}

util.inherits(RFIDParser, SerialParser.Parser);

RFIDParser.prototype.init = function() {
	SerialParser.Parser.prototype.init.apply(this, arguments);
	this.lastCardIDTime = 0;
};

RFIDParser.prototype.processMessage = function(message) {
	if(message.indexOf(CARD_ID_STRING) > 4) {
		var id = this.readId(message);
		this.emit('card', {id: id});
	}
}

RFIDParser.prototype.readId = function(message) {
	var dataStart = 6;
	var cardLength = message.readUInt8(3);
	var id = null;

	id = message.slice(dataStart, dataStart + cardLength).toString('hex');

	return id;
}

RFIDParser.prototype.debounce = function(message) {

	var now = Date.now();
	if ( message.indexOf(CARD_ID_STRING) > 4) {
		this.lastCardIdTime = now;
		if (now - this.lastCardIDTime < this.debounceTime) { 
			return true;
		}
	}
	
	return false;
}


exports.RFIDParser = RFIDParser;

//var DEV_TTY = "/dev/ttyAMA0";
var START_BYTES = new Buffer([0x00, 0x00, 0xFF]);
var END_BYTES = new Buffer([0x00]);
var CARD_ID_STRING = new Buffer([0xD5, 0x4B, 0x01]);

var KEY_ACCESS = [0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF];
var ADDRESS = 0x04;

require('buffertools').extend();
var events = require('events');
var util = require('util');
var _ = require('underscore');

//private anonymous functions

var lengthCheckSum = function(length) {
  return 0x100 - length;
}

var checksum = function(dataTX) {

	var start = 2;
  var end = dataTX.readUInt8(0) + start;
  var sum = 0;
 
  for (var i = start; i < end ; i++) {
    sum += dataTX.readUInt8(i);
  }

	sum = 0x100 - (sum % 0x100);

  dataTX.writeUInt8(sum, end);

  return dataTX;
};

//public class

var RFIDController = function() {

};

util.inherits(RFIDController, events.EventEmitter);

RFIDController.prototype.init = function(config) {
  var self = this;

	this.on('gotFirmware', this.configureSAM.bind(this));
	this.on('configured', this.initRFIDReader.bind(this));	

  this.getFirmware();

};

RFIDController.prototype.sendTX = function(dataTX, callback) {
	var self = this;
  var transmitBytes = Buffer.concat([START_BYTES, dataTX, END_BYTES]);
  callback.apply(self);
};

RFIDController.prototype.getFirmware  = function(callback) {
  var self = this;
	var len = 2;
  var len_checksum = lengthCheckSum(len);
  var dataTX = new Buffer([
    len,
    len_checksum,
    0xD4,
    0x02,
		0x00
	]);

	console.log('get firmware: %s', dataTX.toString('hex'));
	self.emit('gotFirmware');
};

RFIDController.prototype.configureSAM = function(callback) {
  var self = this;
	var len = 5;
  var len_checksum = lengthCheckSum(len);
  var dataTX = new Buffer([
    len,
    len_checksum,
    0xD4,
    0x14,
    0x01, //normal mode
    0x14, //timeout
    0x00, //irq
    0x00  //clean checksum
  ]);

	console.log('configuring: %s', dataTX.toString('hex'));
	self.emit('configured');
};

RFIDController.prototype.initRFIDReader = function() {

	var self = this;
	var len = 0x04;
	var lenCheckSum = lengthCheckSum(len);
	var dataTX = new Buffer([
		len,
		lenCheckSum,
		0xD4,
		0x4A,	//Code
		0x01,	//MaxTarget
		0x00,	//Baud Rate = 106kbps
		0x00	//checksum bit
	]);

	console.log('initializing: %s', dataTX.toString('hex'));
	self.emit('initialized');
	
};

RFIDController.prototype.emitCard = function(card) {
	var self = this;

	self.emit('card', card);
	self.initRFIDReader.call(self);

};


exports.RFIDController = RFIDController;



var DEV_TTY = "/dev/ttyAMA0";
var BAUD_RATE = 115200;
var START_BYTES = new Buffer([0x00, 0x00, 0xFF]);
var END_BYTES = new Buffer([0x00]);
var CARD_ID_STRING = new Buffer([0xD5, 0x4B, 0x01]);

var KEY_ACCESS = [0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF];
var ADDRESS = 0x04;

require('buffertools').extend();
var events = require('events');
var util = require('util');
var _ = require('underscore');
var SerialPort = require('serialport').SerialPort;
var RFIDParser = require('./rfid_parser').RFIDParser;

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

RFIDController.prototype.init = function() {
  var self = this;

	this.ready = false;
	this.lastIdTime = Date.now();

  this.serial = new SerialPort(DEV_TTY, {
    baudrate: BAUD_RATE
  });

	this.rfidParser = new RFIDParser();
	this.rfidParser.init();

  this.serial.on('open', this.configureSAM.bind(this));
	this.on('configured', self.initRFIDReader.bind(self));	
	this.serial.on('data', function(data) {
		if (!self.ready) {
			return;
		}
		self.rfidParser.data.call(self.rfidParser, data);
	});
	this.rfidParser.on('card', this.emitCard.bind(this));

};

RFIDController.prototype.sendTX = function(dataTX, callback) {
	var self = this;
  var transmitBytes = Buffer.concat([START_BYTES, dataTX, END_BYTES]);
	this.serial.write(transmitBytes, function() {
		if (typeof callback === "function") {
			setTimeout(function() {
				callback.apply(self);
			}, 50);
		}
	});

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

  dataTX = checksum(dataTX);

  this.serial.write("               ");
  this.sendTX(dataTX, function() {
		self.emit('configured');
	});
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

	dataTX = checksum(dataTX);

	this.sendTX(dataTX, function() {
		self.ready = true;
		self.emit('initialized');
	});
	
};

RFIDController.prototype.emitCard = function(card) {
	var self = this;

	if (Date.now() - this.lastIdTime > 500) {
		this.ready = false;
		this.serial.flush(function() {
			self.emit('card', card);
			this.lastIdTime = Date.now();
		});
	}
			
	self.initRFIDReader.call(self);

};


exports.RFIDController = RFIDController;


var DEV_TTY = "/dev/ttyAMA0";
var BAUD_RATE = 115200;
var START_BYTES = [0x00, 0x00, 0xFF];
var START_BYTES = [0x00];

var _ = require('underscore');
var SerialPort = require('serialport');

var lengthCheckSum = function(length) {
  return 0x100 - length;
}

var checksum = function(dataTX) {
  for (var i = 0; i < dataTX[0] ; i++) {
    dataTX[dataTX[0] + 2] += dataTX[i + 2];
  }
  dataTX[dataTX[0] + 2]= -1 * dataTX[dataTX[0] + 2];

  return dataTX;
}

var concatBuffer = function(buff1, buff2) {
  var catArray = new Uint8Array(buff1.byteLength + buff2.byteLength);
  catArray.set(new Uint8Array(buff2), 0);
  catArray.set(new Uint8Array(arrayTWO), buff2.byteLength);
  return catArray;
}

var RFIDController = function() {

}

RFIDController.prototype.init = function() {
  var self = this;

  this.serial = new SerialPort(DEV_TTY, {
    baudrate: BAUD_RATE
  });

  this.serial.on('open', function() {
    self.configureSAM.apply(self);
  });

  this.serial.on('data', function(dataRX) {
    console.log(dataRX);
  });
}

RFIDController.prototype.sendTX = function(dataTX) {
  var transmitBytes = concatBuffer(START_BYTES, dataTX);
  transmitBytes = concatBuffer(transmitBytes, END_BYTES);
  this.serial.write(transmitBytes);
}

RFIDController.prototype.configureSAM = function() {
  var len = 5;
  var len_checksum = lengthCheckSum(len);
  var dataTX = new UInt8Array(len + 3);

  dataTX.set([
    len,
    len_checksum,
    0xD4,
    0x14,
    0x01, //normal mode
    0x14, //timeout
    0x00, //irq
    0x10  //clean checksum
  ]);

  dataTX = checksum(dataTX);

  this.serial.write("               ");
  this.sendTX(dataTX, 8, 13);
}



exports.RFIDController = RFIDController;


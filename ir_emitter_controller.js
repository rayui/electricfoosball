var _ = require('underscore');
var gpio = require('rpi-gpio');
var util = require('util');
var events = require('events');

var IREmitter = function() {

}

util.inherits(IREmitter, events.EventEmitter);

IREmitter.prototype.init = function(pin) {
	this.pin = pin;
}

IREmitter.prototype.enable = function() {
	var self = this;

	gpio.on('change', function(channel, state) {
		console.log("channel: %d state %d", channel, state);
	});

	gpio.setPollFrequency(1);

	gpio.setup(this.pin, gpio.DIR_IN, function() {
		self.emit('ready');
		gpio.read(self.pin, function(err, value) {
				console.log('The value is ' + value);
		})
	});
}

IREmitter.prototype.disable = function() {
	gpio.close();
}


exports.IREmitter = IREmitter;



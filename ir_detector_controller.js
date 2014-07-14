// dem Node modules
var _ = require('underscore');
var gpio = require('rpi-gpio');
var util = require('util');
var events = require('events');

var IRDetector = function() {

}

util.inherits(IRDetector, events.EventEmitter);

IRDetector.prototype.init = function(pin) {
	this.pin = pin;
}

IRDetector.prototype.enable = function() {
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

IRDetector.prototype.disable = function() {
	gpio.close();
}


exports.IRDetector = IRDetector;


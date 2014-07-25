require('buffertools').extend();
var events = require('events');
var util = require('util');
var _ = require('underscore');

var LED_LONG = "LED_LONG\n";
var LED_SHORT = "LED_SHORT\n";

var createGoalData = function(side) {
	return {
		side: side,
		time: new Date(Date.now()).toString()
	}
}

var Arduino = function() {

}

util.inherits(Arduino, events.EventEmitter);

Arduino.prototype.init = function(config) {
	var self = this;

	this.lastButtonATime = Date.now();
	this.lastButtonBTime = Date.now();

}

Arduino.prototype.enable = function() {

}

Arduino.prototype.disable = function() {

}

Arduino.prototype.emitGoalA = function() {
	this.emit('goal', createGoalData(0));
}

Arduino.prototype.emitGoalB = function() {
	this.emit('goal', createGoalData(1));
}

Arduino.prototype.emitButtonA = function() {
	this.lastButtonATime = Date.now();
	if (this.lastButtonATime - this.lastButtonBTime > 500) {
		this.emit('button', {id: 0});
	} else {
		this.emit('cancelGoal');
	}
}

Arduino.prototype.emitButtonB = function() {
	this.lastButtonBTime = Date.now();
	if (this.lastButtonBTime - this.lastButtonATime > 500) {
		this.emit('button', {id: 1});
	} else {
		this.emit('cancelGoal');
	}
}

Arduino.prototype.emitButtonC = function() {
	this.emit('button', {id: 2});
}

Arduino.prototype.emitButtonD = function() {
	this.emit('button', {id: 3});
}

Arduino.prototype.shortBlink = function() {
	console.log(LED_SHORT);
}

Arduino.prototype.longBlink = function() {
	console.log(LED_LONG);
}

Arduino.prototype.errorBlink = function() {
	var self = this;
	console.log(LED_SHORT);
	setTimeout(function() {
		console.log(LED_SHORT);
	}, 500);
}

Arduino.prototype.enableBeam = function() {
	console.log("ENABLE_BEAM\n");
}

Arduino.prototype.disableBeam = function() {
	console.log("DISABLE_BEAM\n");
}

exports.Arduino = Arduino;



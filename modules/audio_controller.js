var fs = require('fs');
var events = require('events');
var util = require('util');
var _ = require('underscore');
var lame = require('lame');
var Speaker = require('speaker');

var getFilename = function(name) {
	return __dirname + "/../audio/" + this.files[name] + '.mp3';
}

var AudioController = function() {

};

util.inherits(AudioController, events.EventEmitter);

AudioController.prototype.init = function(config) {
  var self = this;
	this._loop = null;
	this.files = config.files;
};

AudioController.prototype.play = function(sound) {
	try {
		var fd = fs.createReadStream(getFilename(sound))
			.pipe(new lame.Decoder)
			.pipe(new Speaker);
	} catch (err) {
		console.log(err);
	}
};

AudioController.prototype.loop = function(sound, repeats, interval) {
	//-1 loops indefinitely
	var self = this;

	this.play(sound);

	if (repeats > 0 || repeats === -1) {
		this.play(sound);
		this._loop = setTimeout(function() {
			self.loop.apply(self, [sound, repeats === -1 ? -1 : repeats - 1, interval]);	
		}, interval);
	} 

};

AudioController.prototype.unloop = function() {
	this._loop && clearTimeout(this._loop);
};

exports.AudioController = AudioController;


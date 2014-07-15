var fs = require('fs');
var events = require('events');
var util = require('util');
var _ = require('underscore');
var lame = require('lame');
var Speaker = require('speaker');

var files = {
	goal: 'whistle',
	action: 'beep-06',
	userLogin: 'beep-07',
	error: 'beep-09'
};

var getFilename = function(name) {
	return __dirname + "/../audio/" + files[name] + '.mp3';
}

var AudioController = function() {

};

util.inherits(AudioController, events.EventEmitter);

AudioController.prototype.init = function() {
  var self = this;
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

exports.AudioController = AudioController;


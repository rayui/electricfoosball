var fs = require('fs');
var events = require('events');
var util = require('util');
var _ = require('underscore');
var lame = require('lame');
var Speaker = require('speaker');

var files = {
	whistle: 'whistle',
	action: 'beep-07',
	userLogin: 'beep-06',
	error: 'beep-09',
	goal: 'goal-emma',
	goalA: 'silver-goal-emma',
	goalB: 'black-goal-emma',
	scanA: 'silver-selected-emma',
	scanB: 'black-selected-emma',
	gameStarted: 'game-commenced-emma',
	gameAbortOrContinue: 'abort-or-continue-emma',
	gameResumed: 'game-resumed-emma',
	gameAborted: 'game-aborted-emma',
	gameOver: 'game-over-emma',
	selectTeam: 'select-team-emma',
	selectSecondPlayer: 'second-player-emma',
	goalCancelled: 'goal-disqualified-emma'
};

var getFilename = function(name) {
	return __dirname + "/../audio/" + files[name] + '.mp3';
}

var AudioController = function() {

};

util.inherits(AudioController, events.EventEmitter);

AudioController.prototype.init = function() {
  var self = this;
	this._loop = null;
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


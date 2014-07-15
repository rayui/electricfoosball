var events = require('events');
var util = require('util');
var _ = require('underscore');

var Game = function() {

};

util.inherits(Game, events.EventEmitter);

Game.prototype.init = function() {

}

Game.prototype.goal = function(data) {
	console.log("GOAL for team %d at %s", data.side, data.time);
	this.emit("goal");
}

exports.Game = Game;

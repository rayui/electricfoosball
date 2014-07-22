var events = require('events');
var util = require('util');
var _ = require('underscore');

var SILVER = 0;
var BLACK = 1; 

var Player = function(id, side) {
	this.id = id;
	this.side = side;
}

Player.prototype.getTeam = function() {
	if (this.side === SILVER) {
		return "silver";
	} else if (this.side === BLACK) {
		return "black";
	}
};

util.inherits(Player, events.EventEmitter);

exports.Player = Player;

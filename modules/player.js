var events = require('events');
var util = require('util');
var _ = require('underscore');

var Player = function(id, side) {
	this.id = id;
	this.side = side;
}

util.inherits(Player, events.EventEmitter);

exports.Player = Player;

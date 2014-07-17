var events = require('events');
var util = require('util');
var _ = require('underscore');

var Player = function(id) {
	this.id = id;
	this.side = null;
}

util.inherits(Player, events.EventEmitter);

exports.Player = Player;

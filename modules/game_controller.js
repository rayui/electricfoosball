var events = require('events');
var util = require('util');
var _ = require('underscore');
var Player = require('./player.js').Player;

var Game = function() {

};

util.inherits(Game, events.EventEmitter);

Game.prototype.init = function() {
	this.players = [];
}

Game.prototype.goal = function(data) {
	console.log("GOAL for team %d at %s", data.side, data.time);
	this.emit('goal');
}

Game.prototype.button = function(data) {
	console.log("BUTTON %d pressed", data.id);
	this.emit('goal');
}


Game.prototype.signUp = function(card) {
	console.log("GOT CARD WITH ID %s", card.id);

	if (!_.findWhere(this.players, {id: card.id})) {
		this.players.push(new Player(card.id));
		this.emit('newPlayer');
	} else {
		this.emit('error');
	} 
	

}

exports.Game = Game;

var events = require('events');
var util = require('util');
var _ = require('underscore');
var Player = require('./player.js').Player;

var BTN_SIDE_0 = 0;
var BTN_SIDE_1 = 1;
var BTN_START = 2;
var BTN_CANCEL = 3;

var AWAITING_PLAYER = 0;
var AWAITING_SIDE = 10;
var AWAITING_START = 20;
var PLAYING = 30;

var MIN_PLAYERS = 2;
var MAX_PLAYERS = 4;

var Game = function() {

};

util.inherits(Game, events.EventEmitter);

Game.prototype.init = function() {
  this.players = [];
  this.state = AWAITING_PLAYER;
	this.newPlayerId = null;
}

Game.prototype.goal = function(data) {
	if (this.state === PLAYING) {
		console.log("GOAL for team %d at %s", data.side, data.time);
		this.emit('goal', data);
	}
}

Game.prototype.button = function(button) {
	if (this.state === AWAITING_SIDE) {
		if (this.players.length < MAX_PLAYERS) {
			if (button.id === BTN_SIDE_0 || button.id === BTN_SIDE_1) {
				this.addPlayerToTeam(button.id);	
			}
		}
	} else if (this.state < PLAYING) {
		if (button.id === BTN_START) {
			if (this.players.length >= MIN_PLAYERS &&
					this.players.length < MAX_PLAYERS &&
					_.findWhere(this.players, {side:0}).id &&
					_.findWhere(this.players, {side:1}).id
					) {
				this.start();
			} else {
				this.emit('error');
			}
		} else if (button.id === BTN_CANCEL) {
			if (this.state === AWAITING_SIDE) {
				this.newPlayerId = null;
				this.state = AWAITING_PLAYER;
				this.emit('awaitingPlayer');
			}	
		}
	} else if (this.state === PLAYING) {
		if (button.id === BTN_CANCEL) {
			this.players = [];
			this.newPlayerId = null;
			this.state = AWAITING_PLAYER;
			this.emit('reset');
		}
	}
}

Game.prototype.addPlayerToTeam = function(team) {
	var player = new Player(this.newPlayerId, team);
	this.players.push(player);
	this.state = AWAITING_PLAYER;
	this.emit('newPlayer', player);
	console.log('added player to game %j', this.players[this.players.length - 1]);
}

Game.prototype.processCard = function(card) {
  console.log("GOT CARD WITH ID %s", card.id);

  if (this.state === AWAITING_PLAYER) {
		if (!_.findWhere(this.players, {id: card.id})) {
			this.newPlayerId = card.id;
			this.state = AWAITING_SIDE;
			this.emit('read_rfid_card');
		} else {
			this.emit('error');
		} 
  }

}

Game.prototype.start = function() {
	this.state = PLAYING;
	this.emit('started');
	console.log('started game with players %j', this.players);
}

Game.prototype.stop = function() {
	this.players = [];
	this.state = AWAITING_PLAYER;
	this.emit('stopped');
	console.log('stopped game');
}

exports.Game = Game;

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
var ABORTING = 60;

var MIN_PLAYERS = 2;
var MAX_PLAYERS = 4;

var validTeams = function(players) {
	if (players.length >= MIN_PLAYERS &&
			players.length < MAX_PLAYERS &&
			_.findWhere(players, {side:0}) &&
			_.findWhere(players, {side:1})
			) {
		return true;
	}
	return false;
}

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
			if (validTeams(this.players)) {
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
			this.state = ABORTING;
			this.emit('aborting');
			setTimeout(this.resume.bind(this), 5000);
		}
	} else if (this.state === ABORTING) {
		if (button.id === BTN_START) {
			this.reset();
		} else if (button.id === BTN_CANCEL) {
			this.resume();
		}
	}
}

Game.prototype.addPlayerToTeam = function(team) {
	var player = new Player(this.newPlayerId, team);
	this.players.push(player);
	this.state = AWAITING_PLAYER;
	this.emit('newPlayer', player);
}

Game.prototype.processCard = function(card) {
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
}

Game.prototype.stop = function() {
	this.players = [];
	this.state = AWAITING_PLAYER;
	this.emit('stopped');
}

Game.prototype.reset = function() {
	this.players = [];
	this.newPlayerId = null;
	this.state = AWAITING_PLAYER;
	this.emit('reset');
}

Game.prototype.resume = function() {
	if (this.state === ABORTING) {
		if (validTeams(this.players)) {
			this.state = PLAYING;
			this.emit('resumed');
		} else {
			this.reset();
		}
	}
}

exports.Game = Game;

var events = require('events');
var util = require('util');
var _ = require('underscore');
var Player = require('./player.js').Player;

var AWAITING_PLAYER = 0;
var AWAITING_SIDE = 10;
var AWAITING_START = 20;
var PLAYING = 30;
var ABORTING = 60;

var Game = function() {

};

util.inherits(Game, events.EventEmitter);

Game.prototype.init = function(config) {
	this.buttons = config.buttons;
	this.minPlayers = config.minPlayers;
	this.maxPlayers = config.maxPlayers;
  this.players = [];
  this.state = AWAITING_PLAYER;
	this.newPlayerId = null;
	this.startTime = null;
}

Game.prototype.goal = function(goal) {
	if (this.state === PLAYING) {
		this.emit('goal', goal);
	}
}

Game.prototype.validTeams = function() {
	if (this.players.length >= this.minPlayers &&
			this.players.length < this.maxPlayers &&
			_.findWhere(this.players, {side:this.side0}) &&
			_.findWhere(this.players, {side:this.side1})
			) {
		return true;
	}
	return false;
}

Game.prototype.button = function(button) {
	if (this.state === AWAITING_SIDE) {
		if (this.players.length < this.maxPlayers) {
			if (button.id === this.buttons.side0 || button.id === this.buttons.side1) {
				this.addPlayerToTeam(button.id);	
			}
		}
	} else if (this.state < PLAYING) {
		if (button.id === this.buttons.start) {
			if (this.validTeams(this.players)) {
				this.start();
			} else {
				this.emit('error');
			}
		} else if (button.id === this.buttons.cancel) {
			if (this.state === AWAITING_SIDE) {
				this.newPlayerId = null;
				this.state = AWAITING_PLAYER;
				this.emit('awaitingPlayer');
			}	
		}
	} else if (this.state === PLAYING) {
		if (button.id === this.buttons.cancel) {
			this.state = ABORTING;
			this.emit('aborting');
			setTimeout(this.resume.bind(this), 7000);
		}
	} else if (this.state === ABORTING) {
		if (button.id === this.buttons.start) {
			this.reset();
		} else if (button.id === this.buttons.cancel) {
			this.resume();
		}
	}
}

Game.prototype.cancelGoal = function() {
	if (this.state === PLAYING) {
		this.emit('cancelGoal');
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
	this.startTime = Date.now();
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

var events = require('events');
var util = require('util');
var _ = require('underscore');

var HTTPClient = function() {

};

HTTPClient.prototype.sendPlayer = function(player) {
	//POST to /signatures
	/*
		{team: 'silver', rfid: 'rfid'}
	*/
}

HTTPCLient.prototype.sendGoal = function(gameId, teamString) {
	//POST to /games/{game-id}/goals/{side}
	/*
		no payload
	*/	
}

HTTPClient.prototype.sendTeams = function(gameId, players) {
	//POST to /games/{game-id}
	/*
	{
		type: 'team',
		players: [ ],
		score: 0,
		colour: 'silver'
	}
	*/
}

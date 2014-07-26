var events = require('events');
var util = require('util');
var _ = require('underscore');
var request = require('request');

var HTTPClient = function() {

};

util.inherits(HTTPClient, events.EventEmitter);

HTTPClient.prototype.init = function(config, token) {
	this.protocol = config.protocol;
	this.server = config.server;
	this.port = config.port;
	this.token = token; 
}

HTTPClient.prototype.postRequest = function(endpoint, payload, callback) {
	var address = this.protocol + "://" + this.server + "/api/" + endpoint;

	payload.timestamp = new Date().toISOString();

	var reqData = 
		{
			uri: address,
			headers: {
				'Authorization': 'Token token=' + this.token
			},
			form: payload,
		};
		
	console.log("%j", reqData);

	request.post(
		reqData,
		callback
	);
	
}

HTTPClient.prototype.sendPlayer = function(player) {
	//POST to /signatures
	/*
		{team: 'silver', rfid: 'rfid'}
	*/

	var team = player.side === 0 ? "silver" : "black";

	this.postRequest("signatures",
		{
			rfid: player.id,
			team: team
		},
		function(err, res, body) {
			console.log("body %j", body);
		}
	);
}

HTTPClient.prototype.sendGoal = function(goal) {
	//POST to /games/{game-id}/goals/{side}
	/*
		no payload
	*/	

	var team = goal.side === 0 ? "silver" : "black";
	
	this.postRequest("games/" + goal.gameId + "/goals/" + team,
		{},
		function(err, res, body) {
			console.log("body %j", body);
		}		
	);
}

HTTPClient.prototype.createGame = function(players) {
	//POST to /games/
	/*
	{
		type: 'team',
		players: [ ],
		score: 0,
		colour: 'silver'
	}
	*/

	var self = this;

	var silverTeam = _.chain(players).where({side: 0}).pluck('id').value().join(',');
	var blackTeam = _.chain(players).where({side: 1}).pluck('id').value().join(',');

	this.postRequest("games",
		{
			silver_team: silverTeam,
			black_team: blackTeam		
		},
		function(err, res, body) {
			console.log(res);
			var gameId = JSON.parse(res.body).game_id;
			self.emit('newGame', {id: gameId});
		}
	);
}

exports.HTTPClient = HTTPClient;

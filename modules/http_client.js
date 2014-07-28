var events = require('events');
var util = require('util');
var _ = require('underscore');
var request = require('request');

//var querystring = require('querystring');
//var http = require('http');

var HTTPClient = function() {

};

util.inherits(HTTPClient, events.EventEmitter);

HTTPClient.prototype.init = function(config, token) {
	this.protocol = config.protocol;
	this.server = config.server;
	this.port = config.port;
	this.token = token; 
}

HTTPClient.prototype.getAddress = function(endpoint) {
	return this.protocol + "://" + this.server + ":" + this.port + "/api/" + endpoint;
}

HTTPClient.prototype.request = function(method, endpoint, payload, callback) {
	payload.timestamp = new Date().toISOString();
	
	var address = this.getAddress(endpoint);
	
	var reqData = 
		{
			uri: address,
			headers: {
				'Authorization': 'Token token=' + this.token,
				'Content-Type': 'application/json'
			},
			timeout: 10000,
			followRedirect: true,
			form: payload
		};
	
	console.log(reqData);

	request[method](
		reqData,
		callback);
}

HTTPClient.prototype.deleteRequest = function(endpoint, payload, callback) {

	this.request("del", endpoint, payload, callback);
	
}


HTTPClient.prototype.postRequest = function(endpoint, payload, callback) {

	this.request("post", endpoint, payload, callback);
	
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
			console.log(body);
		}
	);
}

HTTPClient.prototype.sendGoal = function(goal) {
	//POST to /games/{game-id}/goals/{side}
	/*
		no payload
	*/	

	var team = goal.side === 0 ? "silver" : "black";
	
	console.log("games/" + goal.gameId + "/goals/" + team + ".json");

	this.postRequest("games/" + goal.gameId + "/goals/" + team + ".json",
		{},
		function(err, res, body) {
			console.log(body);
		}		
	);
}

HTTPClient.prototype.cancelGoal = function(goal) {
	//DELETE to /games/{game-id}/goals/{side}
	/*
		no payload
	*/	

	var team = goal.side === 0 ? "silver" : "black";
	
	console.log("games/" + goal.id + "/goals/" + team + ".json");

	this.deleteRequest("games/" + goal.id + "/goals/" + team + ".json",
		{},
		function(err, res, body) {
			console.log(res.statusCode);

			console.log(body);
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

	this.postRequest("games.json",
		{
			silver_team: silverTeam,
			black_team: blackTeam		
		},
		function(err, res, body) {
			console.log(body);
			var gameId = JSON.parse(res.body).id;
			self.emit('newGame', {id: gameId});
		}
	);
}

exports.HTTPClient = HTTPClient;

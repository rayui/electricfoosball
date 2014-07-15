var Server = require("./modules/server").Server;
var RFIDController = require('./modules/rfid_controller').RFIDController;
var Arduino = require('./modules/arduino_controller').Arduino;
var Game = require('./modules/game_controller').Game;
var Audio = require('./modules/audio_controller').AudioController;

var server = new Server();
var rfidController = new RFIDController();
var arduino = new Arduino();
var game = new Game();
var audio = new Audio();

rfidController.init();
rfidController.on('card', function(card) {
	audio.play('action');
	console.log("GOT CARD WITH ID %s", card.id);
});

arduino.init();
arduino.on('goal', function(goal) {
	game.goal(goal);
});

game.init();
game.on('goal', function() {
	audio.play('goal');
});

audio.init();

server.init(process.argv[2] || 80);


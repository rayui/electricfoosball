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
	game.signUp(card);
});

arduino.init();
arduino.on('goal', function(goal) {
	game.goal(goal);
});
arduino.on('button', function(button) {
	game.button(button);
});

game.init();
game.on('goal', function() {
	audio.play('goal');
});
game.on('newPlayer', function() {
	console.log('login');
	audio.play('userLogin');
});
game.on('error', function() {
	console.log('error')
	audio.play('error');
});

audio.init();

server.init(process.argv[2] || 80);


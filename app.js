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
	game.processCard(card);
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
	arduino.longBlink();
	arduino.enableBeam();
});
game.on('started', function() {
	audio.play('goal');
	arduino.longBlink();
	arduino.enableBeam();
});
game.on('read_rfid_card', function() {
	arduino.shortBlink();
	audio.play('action');
});
game.on('awaitingPlayer', function() {
	arduino.shortBlink();
});
game.on('newPlayer', function() {
	console.log('login');
	audio.play('userLogin');
	arduino.longBlink();
});
game.on('error', function() {
	console.log('error')
	audio.play('error');
	arduino.disableBeam();
	arduino.errorBlink();
});
game.on('reset', function() {
	console.log('reset game');
	audio.play('error');
	arduino.disableBeam();
	arduino.errorBlink();
});

audio.init();

//server.init(process.argv[2] || 80);
arduino.once('button', function() {
	rfidController.emit('card', {id:1192138132});
});

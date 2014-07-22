var RFIDController = require('./modules/rfid_controller').RFIDController;
var Arduino = require('./modules/arduino_controller').Arduino;
var Game = require('./modules/game_controller').Game;
var Audio = require('./modules/audio_controller').AudioController;

var rfidController = new RFIDController();
var arduino = new Arduino();
var game = new Game();
var audio = new Audio();

//add RFID events
rfidController.on('card', function(card) {
	game.processCard(card);
});

//add arduino events
arduino.on('goal', function(goal) {
	game.goal(goal);
});
arduino.on('button', function(button) {
	game.button(button);
});
arduino.on('cancelGoal', function() {
	game.cancelGoal();
});

//add game events
game.on('goal', function(goal) {
	if (goal.side === 0) {
		audio.play('goalA');
	} else if (goal.side === 1) {
		audio.play('goalB');
	}
	setTimeout(function() {
		audio.play('whistle');
	}, 1500);
	arduino.longBlink();
	arduino.enableBeam();
});
game.on('started', function() {
	setTimeout(function() {
		audio.play('whistle');
	}, 1500);
	audio.play('gameStarted');
	arduino.longBlink();
	arduino.enableBeam();
});
game.on('read_rfid_card', function() {
	arduino.shortBlink();
	audio.play('selectTeam');
});
game.on('awaitingPlayer', function() {
	arduino.shortBlink();
});
game.on('newPlayer', function(player) {
	console.log('login');
	if (player.side === 0) {
		audio.play('scanA');
	} else if (player.side === 1) {
		audio.play('scanB');
	}
	arduino.longBlink();
});
game.on('error', function() {
	console.log('error')
	audio.play('error');
	arduino.errorBlink();
});
game.on('aborting', function() {
	console.log('aborting game');
	arduino.errorBlink();
	arduino.disableBeam();
	audio.play('gameAbortOrContinue');
});
game.on('resumed', function() {
	console.log('resume game');
	audio.play('gameResumed');
	arduino.longBlink();
	arduino.enableBeam();
});
game.on('reset', function() {
	console.log('reset game');
	audio.play('gameOver');
	arduino.disableBeam();
	arduino.longBlink();
});
game.on('cancelGoal', function() {
	console.log('cancelling last goal');
	audio.play('goalCancelled');
	arduino.longBlink();
	arduino.enableBeam();
});

audio.init();
arduino.init();
game.init();
rfidController.init();


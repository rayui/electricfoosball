module.exports = {
	arduino: {
		tty: '/home/pi/COM1',
		baud: 9600		
	},
	audio: {
		files: {
			whistle: 'whistle',
			action: 'beep-07',
			userLogin: 'beep-06',
			error: 'beep-09',
			goal: 'goal-emma',
			goalA: 'silver-goal-emma',
			goalB: 'black-goal-emma',
			scanA: 'silver-selected-emma',
			scanB: 'black-selected-emma',
			gameStarted: 'game-commenced-emma',
			gameAbortOrContinue: 'abort-or-continue-emma',
			gameResumed: 'game-resumed-emma',
			gameAborted: 'game-aborted-emma',
			gameOver: 'game-over-emma',
			selectTeam: 'select-team-emma',
			selectSecondPlayer: 'second-player-emma',
			goalCancelled: 'goal-disqualified-emma'
		}	
	},
	game: {
		buttons: {
			side0: 0,
			side1: 1,
			start: 2,
			cancel: 3,
		},
		minPlayers: 2,
		maxPlayers: 4
	},
	rfid: {
		tty: '/home/pi/COM2',
		baud: 115200,
	}
}

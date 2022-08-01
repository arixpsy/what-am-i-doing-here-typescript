import Phaser from 'phaser'

const config: Phaser.Types.Core.GameConfig = {
	width: 1000,
	height: 500,
	pixelArt: true,
	parent: 'phaser',
	dom: {
		createContainer: true,
	},
	physics: {
		default: 'arcade',
		arcade: {
			debug: false,
			gravity: { y: 700 },
		},
	},
	scale: {
		mode: Phaser.Scale.FIT,
		autoCenter: Phaser.Scale.CENTER_BOTH,
	},
}

const game = new Phaser.Game(config)

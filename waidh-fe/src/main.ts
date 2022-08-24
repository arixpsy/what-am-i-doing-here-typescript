import Phaser from 'phaser'
import Loader from './scenes/Loader'
import Login from './scenes/Login'
import { Forest, Street } from './scenes/AllMaps'
import io from 'socket.io-client'

const config: Phaser.Types.Core.GameConfig = {
	width: 1000,
	height: 500,
	pixelArt: true,
	parent: 'phaser',
	dom: {
		createContainer: true,
	},
	scene: [Loader, Login, Forest, Street],
	physics: {
		default: 'arcade',
		arcade: {
			debug: true,
			gravity: { y: 750 },
		},
	},
	scale: {
		mode: Phaser.Scale.FIT,
		autoCenter: Phaser.Scale.CENTER_BOTH,
	},
}

const game = new Phaser.Game(config)

game.registry.set(
	'socket',
	io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000', {
		withCredentials: true,
		autoConnect: false,
		transports: ['websocket'],
	})
)

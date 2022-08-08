import Phaser, { Scene } from 'phaser'
import { PlayerInfoWithXY } from '../@types'
import { MapKey, SettingKey, SoundKey, SpriteKey } from '../utils/key'
import MapData, { PortalData } from '../utils/map'
import SoundData from '../utils/sound'
import SpriteData from '../utils/sprite'
import { Socket } from 'socket.io-client'
import { SocketEvent } from '../utils/socket'
import { initVolume } from '../utils/functions/volume'
import Player from '../objects/player'

class Map extends Scene {
	private map: MapKey
	private localPlayer?: Player
	private players: Record<string, Player>
	private ground?: Phaser.Physics.Arcade.StaticGroup
	private platforms: Array<Phaser.Types.Physics.Arcade.ImageWithDynamicBody>
	private portals: Array<{
		data: PortalData
		sprite: Phaser.GameObjects.Sprite
	}>
	private bgm?: Phaser.Sound.BaseSound
	private keyLeft?: Phaser.Input.Keyboard.Key
	private keyRight?: Phaser.Input.Keyboard.Key
	private keySpace?: Phaser.Input.Keyboard.Key
	private keyUp?: Phaser.Input.Keyboard.Key

	constructor(key: MapKey) {
		super(key)
		this.map = key
		this.platforms = []
		this.portals = []
		this.players = {}
	}

	async create() {
		this.cameras.main.fadeIn(750, 0, 0, 0)
		this.createMap()
		this.addSound()
		this.addKeyboard()
		this.setupSocket()
		// TODO: add ui
		// TODO: add ccui
		// TODO: addsocialui
		// TODO: add chat ui
		// TODO: add message function
		// TODO: add player movement
	}

	// GETTERS
	getGround() {
		return this.ground
	}

	getPlatforms() {
		return this.platforms
	}

	// CREATE FUNCTIONS
	createMap() {
		const map = MapData[this.map]
		const {
			platform: { ground: mapGround, others: mapPlatforms },
			portals,
		} = map
		this.add.image(0, 0, map.key).setOrigin(0, 0)

		this.ground = this.physics.add.staticGroup()
		this.ground
			.create(map.dimensions.width / 2, map.dimensions.height, mapGround.key)
			.refreshBody()

		if (mapPlatforms) {
			for (const platform of mapPlatforms) {
				if (Array.isArray(platform.x) && Array.isArray(platform.y)) {
					for (const index in platform.x) {
						this.createPlatform(
							platform.x[index],
							platform.y[index],
							platform.key
						)
					}
				} else if (!Array.isArray(platform.x) && !Array.isArray(platform.y)) {
					this.createPlatform(platform.x, platform.y, platform.key)
				}
			}
		}

		for (const portal of Object.values(portals)) {
			const newPortal = this.add.sprite(
				portal.x,
				portal.y,
				SpriteData.PORTAL_SPRITE.idle.key
			)
			newPortal.play(SpriteData.PORTAL_SPRITE.idle.key)
			newPortal.setOrigin(0.5, 1)
			this.portals.push({ sprite: newPortal, data: portal })
		}
	}

	createPlatform(x: number, y: number, imageKey: string) {
		const newPlatform = this.physics.add.image(x, y, imageKey)
		newPlatform.body.setAllowGravity(false)
		newPlatform.body.setImmovable(true)
		newPlatform.body.checkCollision.left = false
		newPlatform.body.checkCollision.right = false
		newPlatform.body.checkCollision.down = false
		this.platforms?.push(newPlatform)
	}

	addSound() {
		const soundManager = this.sound as Phaser.Sound.HTML5AudioSoundManager
		initVolume(soundManager)

		soundManager.add(SoundKey.JUMP)
		soundManager.add(SoundKey.PORTAL)

		this.bgm = soundManager.add(SoundData[MapData[this.map].sound].key, {
			loop: true,
		})
		this.bgm.play()
	}

	addKeyboard() {
		this.keyLeft = this.input.keyboard.addKey(
			Phaser.Input.Keyboard.KeyCodes.LEFT
		)
		this.keyRight = this.input.keyboard.addKey(
			Phaser.Input.Keyboard.KeyCodes.RIGHT
		)
		this.keySpace = this.input.keyboard.addKey(
			Phaser.Input.Keyboard.KeyCodes.SPACE
		)
		// this.keySpace.on('down', (event) => {
		// 	this.player.jump()
		// })
		// this.keyUp = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP)
		// this.keyUp.on('down', (event) => {
		// 	const newLocalPlayerInfo = this.player.portal()
		// 	if (newLocalPlayerInfo) {
		// 		this.player.disconnect()
		// 		this.bgm.stop()
		// 		this.input.keyboard.removeAllKeys(true)
		// 		this.scene.start(newLocalPlayerInfo.map, newLocalPlayerInfo)
		// 	}
		// })
	}

	setupSocket() {
		const io: Socket = this.registry.get('socket')

		io.emit(SocketEvent.JOIN_MAP, undefined, (data: PlayerInfoWithXY) => {
			const localPlayer = new Player(data, this, true)
			this.players[data.uid] = localPlayer
			this.setupCamera(localPlayer)
			this.localPlayer = localPlayer

			io.emit(
				SocketEvent.REQUEST_ALL_PLAYERS,
				undefined,
				(data: Record<string, PlayerInfoWithXY>) => {
					for (const player of Object.values(data)) {
						if (player.uid !== localPlayer.getUid()) {
							this.players[player.uid] = new Player(player, this, false)
						}
					}
				}
			)
		})

		io.on(SocketEvent.PLAYER_CONNECT, (player: PlayerInfoWithXY) => {
			this.players[player.uid] = new Player(player, this, false)
		})

		io.on(SocketEvent.PLAYER_DISCONNECT, (player: PlayerInfoWithXY) => {
			const { uid } = player
			this.players[player.uid].getContainer().destroy()
			delete this.players[player.uid]
		})

		// TODO: onPlayerMove
		// TODO: onPlayerStop
		// TODO: onDisconnect
		// TODO: onPlayerMessage
		// TODO: emitChangeMap
		// TODO: emitSendMessage
		// TODO: emitGetChannelStatus
		// TODO: emitChangeChannel
	}

	setupCamera(player: Player) {
		const map = MapData[this.map]

		this.physics.world.setBounds(
			0,
			0,
			map.dimensions.width,
			map.dimensions.height
		)
		this.cameras.main.setBounds(
			0,
			0,
			map.dimensions.width,
			map.dimensions.height
		)
		this.cameras.main.startFollow(player.getContainer(), true)
	}

	update() {}
}

export default Map

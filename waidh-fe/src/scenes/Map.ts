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
	private isPortalLoading: boolean = false

	constructor(key: MapKey) {
		super(key)
		this.map = key
		this.platforms = []
		this.portals = []
		this.players = {}
	}

	async create() {
		this.cameras.main.fadeOut(0, 0, 0, 0)
		this.createMap()
		this.addSound()
		this.addKeyboard()
		this.setupSocket()
		// TODO: add ui
		// TODO: add ccui
		// TODO: addsocialui
		// TODO: add chat ui
		// TODO: add message function
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
		this.keySpace.on('down', () => this.jumpLocalPlayer())

		this.keyUp = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP)
		this.keyUp.on('down', () => {
			if (!this.localPlayer) return
			const container = this.localPlayer.getContainer()
			const containerBody = container.body as Phaser.Physics.Arcade.Body
			const { x, y } = containerBody
			for (const portal of this.portals) {
				const { width: portalWidth } = SpriteData.PORTAL_SPRITE.dimensions
				const portalLeftBound = portal.sprite.x - portalWidth / 2
				const portalRightBound = portal.sprite.x + portalWidth / 2

				if (
					containerBody.touching.down &&
					x > portalLeftBound &&
					x < portalRightBound
				) {
					this.isPortalLoading = true
					this.stopLocalPlayer()
					this.changeMap(portal.data)
					return
				}
			}
		})
	}

	setupSocket() {
		const io: Socket = this.registry.get('socket')

		io.emit(SocketEvent.JOIN_MAP, undefined, (data: PlayerInfoWithXY) => {
			const localPlayer = new Player(data, this, true)
			this.players[data.uid] = localPlayer
			this.setupCamera(localPlayer)
			this.localPlayer = localPlayer
			this.cameras.main.fadeIn(750, 0, 0, 0)

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
			this.players[uid].getContainer().destroy()
			delete this.players[uid]
		})

		io.on(SocketEvent.PLAYER_MOVE, (playerMovement: PlayerInfoWithXY) => {
			if (!playerMovement.x || !playerMovement.y) return

			const player = this.players[playerMovement.uid]
			if (!player) return

			const sprite = player.getSprite()
			if (!sprite) return
			
			const spriteInfo = SpriteData[player.getSpriteType()]
			const { x: prevX } = player.getPrevXY()

			if (prevX) {
				if (prevX < playerMovement.x) {
					sprite.flipX = true
				} else if (prevX > playerMovement.x) {
					sprite.flipX = false
				}

				if (spriteInfo.moving) {
					sprite.play(spriteInfo.moving.key, true)
				}
			}

			player.getContainer().setX(playerMovement.x)
			player.getContainer().setY(playerMovement.y)
			player.setXY(playerMovement.x, playerMovement.y)
		})

		io.on(SocketEvent.PLAYER_STOP, (playerMovement: PlayerInfoWithXY) => {
			if (!playerMovement.x || !playerMovement.y) return
			
			const player = this.players[playerMovement.uid]
			if (!player) return

			const sprite = player.getSprite()
			if (!sprite) return

			const spriteInfo = SpriteData[player.getSpriteType()]

			sprite.play(spriteInfo.idle.key, true)
			player.getContainer().setX(playerMovement.x)
			player.getContainer().setY(playerMovement.y)
			player.setXY(playerMovement.x, playerMovement.y)
		})

		// TODO: onPlayerMessage
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

	moveLocalPlayer() {
		if (!this.localPlayer) return
		const { isMovingRight, isMovingLeft } = this.localPlayer.getPlayerState()
		const sprite = this.localPlayer.getSprite()
		const spriteInfo = SpriteData[this.localPlayer.getSpriteType()]
		const container = this.localPlayer.getContainer()
		const containerBody = container.body as Phaser.Physics.Arcade.Body

		if (isMovingLeft) {
			sprite.flipX = false
			containerBody.setVelocityX(-150)
		} else if (isMovingRight) {
			sprite.flipX = true
			containerBody.setVelocityX(150)
		}

		if (!spriteInfo.moving) return
		sprite.play(spriteInfo.moving?.key, true)
		this.localPlayer.setXY(container.x, container.y)
	}

	stopLocalPlayer() {
		if (!this.localPlayer) return
		const sprite = this.localPlayer.getSprite()
		const spriteInfo = SpriteData[this.localPlayer.getSpriteType()]
		const container = this.localPlayer.getContainer()
		const containerBody = container.body as Phaser.Physics.Arcade.Body

		containerBody.setVelocityX(0)
		sprite.play(spriteInfo.idle.key, true)
		this.localPlayer.setXY(container.x, container.y)
	}

	jumpLocalPlayer() {
		if (!this.localPlayer) return
		const soundManager = this.sound as Phaser.Sound.HTML5AudioSoundManager
		const container = this.localPlayer.getContainer()
		const containerBody = container.body as Phaser.Physics.Arcade.Body

		if (containerBody.touching.down) {
			containerBody.setVelocityY(-275)
			soundManager.play(SoundKey.JUMP)
		}
	}

	sendMovement() {
		if (!this.localPlayer) return
		const io: Socket = this.registry.get('socket')
		io.emit(SocketEvent.CLIENT_MOVEMENT, this.localPlayer.getXY())
	}

	sendStop() {
		if (!this.localPlayer) return
		const io: Socket = this.registry.get('socket')
		io.emit(SocketEvent.CLIENT_MOVEMENT_STOP, this.localPlayer.getXY())
	}

	changeMap(portalData: PortalData) {
		const { mapKey, portal } = portalData.to
		if (!this.localPlayer) return
		const io: Socket = this.registry.get('socket')
		const soundManager = this.sound as Phaser.Sound.HTML5AudioSoundManager

		io.emit(SocketEvent.CHANGE_MAP, { map: mapKey, portal }, () => {
			soundManager.play(SoundKey.PORTAL)
			this.cameras.main.fadeOut(750, 0, 0, 0)
			this.cameras.main.once('camerafadeoutcomplete', () => {
				this.scene.add(mapKey, MapData[mapKey].class)
				this.scene.start(mapKey)
				this.bgm?.stop()
				this.input.keyboard.removeAllKeys(true)
				this.scene.remove()
			})
		})
	}

	update() {
		if (this.isPortalLoading) return
		if (this.localPlayer) {
			if (this.keyLeft && this.keyRight) {
				if (this.keyLeft.isDown) {
					this.localPlayer.moveLeft()
				}

				if (this.keyLeft.isUp) {
					this.localPlayer.stopLeft()
				}

				if (this.keyRight.isDown) {
					this.localPlayer.moveRight()
				}

				if (this.keyRight.isUp) {
					this.localPlayer.stopRight()
				}
			}

			const { isMoving, x } = this.localPlayer.getPlayerState()
			const container = this.localPlayer.getContainer()
			const containerBody = container.body as Phaser.Physics.Arcade.Body

			if (isMoving) {
				this.moveLocalPlayer()
				this.sendMovement()
			} else if (!isMoving && !containerBody.touching.down) {
				this.localPlayer.setXY(container.x, container.y)
				this.sendStop()
			} else {
				if (x !== this.localPlayer.getPrevXY().x) {
					this.sendStop()
				}
				this.stopLocalPlayer()
			}
		}
	}
}

export default Map

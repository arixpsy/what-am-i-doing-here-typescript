import { Scene } from 'phaser'
import { PlayerInfoWithXY } from '../@types'
import Map from '../scenes/Map'
import MapData from '../utils/map'
import SpriteData from '../utils/sprite'

export enum SpriteState {
	MOVING,
	STOP,
}

class Player {
	private info: PlayerInfoWithXY
	private container: Phaser.GameObjects.Container
	private sprite: Phaser.GameObjects.Sprite
	private state: SpriteState

	constructor(player: PlayerInfoWithXY, scene: Map, isLocalPlayer: Boolean) {
		this.state = SpriteState.STOP
		this.info = player

		const map = MapData[player.map]
		const playerSpriteType = SpriteData[player.spriteType]
		const sceneGround = scene.getGround()
		const scenePlatforms = scene.getPlatforms()

		let spawnX = map.spawn.x
		let spawnY = map.spawn.y

		if (player.x && player.y) {
			spawnX = player.x
			spawnY = player.y
		} else if (player.portal) {
			spawnX = map.portals[player.portal].x
			spawnY =
				map.portals[player.portal].y -
				playerSpriteType.dimensions.height / 2 -
				map.portals[player.portal].spawnOffset +
				35
		}

		this.sprite = scene.add
			.sprite(0, 15, playerSpriteType.idle.key)
			.setOrigin(0.5, 1)
			.play(playerSpriteType.idle.key, true)

		const nameLabel = scene.add
			.text(0, 0, player.displayName, {
				fontFamily: 'monospace',
				backgroundColor: 'rgba(0,0,0,0.7)',
				padding: {
					x: 5,
					y: 2,
				},
			})
			.setOrigin(0.5, 0)
			.setY(20)

		this.container = scene.add
			.container(spawnX, spawnY)
			.setSize(30, 30)
			.add(this.sprite)
			.add(nameLabel)

		if (isLocalPlayer) {
			scene.registry.set('localPlayerUid', player.uid)
			scene.physics.world.enable(this.container)
			if (
				sceneGround &&
				this.container.body instanceof Phaser.Physics.Arcade.Body
			) {
				scene.physics.add.collider(this.container, sceneGround)
				this.container.body.setCollideWorldBounds(true)
			}

			if (scenePlatforms.length > 0) {
				for (const platform of scenePlatforms) {
					scene.physics.add.collider(this.container, platform)
				}
			}
		}
	}

	getUid() {
		return this.info.uid
	}

	getContainer() {
		return this.container
	}

	getSprite() {
		return this.sprite
	}
}

export default Player

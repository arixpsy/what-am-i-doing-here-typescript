import Phaser, { Scene } from 'phaser'
import { MapKey, SoundKey } from '../utils/key'
import MapData from '../utils/map'
import SoundData from '../utils/sound'

export class Map extends Scene {
	private map: MapKey
	// private portals: Array<any>
	// public platforms: Array<any>
	private background?: Phaser.GameObjects.Image
	public ground?: Phaser.Physics.Arcade.StaticGroup
	private bgm?: Phaser.Sound.BaseSound

	constructor(key: MapKey) {
		super(key)
		this.map = key
		// this.portals = []
		// this.platforms = []
		// this.transition = undefined
	}

	create() {
		this.cameras.main.fadeIn(750, 0, 0, 0)
		this.addMap()
		this.addSound()
	}

	addMap() {
		const map = MapData[this.map]
		this.add.image(0, 0, map.key).setOrigin(0, 0)
	}

	addSound() {
		this.sound.add(SoundKey.JUMP)
		this.sound.add(SoundKey.PORTAL)

		this.bgm = this.sound.add(SoundData[MapData[this.map].sound].key, {
			loop: true,
		})
		this.bgm.play()
	}
}

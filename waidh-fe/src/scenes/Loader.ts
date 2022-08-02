import Phaser from 'phaser'
import { BackgroundKey, SceneKey } from '../utils/key'
import MapData from '../utils/map'
import SoundData from '../utils/sound'
import SpriteData from '../utils/sprite'
import LoginBG from './../assets/backgrounds/park.png'

class Loader extends Phaser.Scene {
	private progressRect?: Phaser.Geom.Rectangle
	private progressCompleteRect?: Phaser.Geom.Rectangle
	private progressBar?: Phaser.GameObjects.Graphics

	constructor() {
		super(SceneKey.LOADER)
	}

	preload() {
		this.load.image(BackgroundKey.LOGIN_BACKGROUND, LoginBG)

		for (const map of Object.values(MapData)) {
			this.load.image(map.key, map.image)
			if (map.platform) {
				this.load.image(map.platform.ground.key, map.platform.ground.image)

				if (map.platform.others) {
					for (const platform of map.platform.others) {
						this.load.image(platform.key, platform.image)
					}
				}
			}
		}

		for (const sprite of Object.values(SpriteData)) {
			if (sprite.idle) {
				this.load.spritesheet(sprite.idle.key, sprite.idle.spriteSheet, {
					frameWidth: sprite.dimensions.width,
					frameHeight: sprite.dimensions.height,
				})
			}
			if (sprite.moving) {
				this.load.spritesheet(sprite.moving.key, sprite.moving.spriteSheet, {
					frameWidth: sprite.dimensions.width,
					frameHeight: sprite.dimensions.height,
				})
			}
		}

		for (const sound of Object.values(SoundData)) {
			this.load.audio(sound.key, sound.audio)
		}

		this.load.on('progress', this.onLoadProgress, this)
		this.load.on('complete', this.onLoadComplete, this)
		this.createProgressBar()
	}

	createProgressBar() {
		let Rectangle = Phaser.Geom.Rectangle
		let main = this.cameras.main

		this.progressRect = new Rectangle(0, 0, main.width / 2, 50)
		Rectangle.CenterOn(this.progressRect, main.centerX, main.centerY)

		this.progressCompleteRect = Phaser.Geom.Rectangle.Clone(this.progressRect)

		this.progressBar = this.add.graphics()
	}

	onLoadProgress(progress: number) {
		let color = 0xffffff
		if (!this.progressBar || !this.progressRect || !this.progressCompleteRect)
			return
		this.progressRect.width = progress * this.progressCompleteRect.width
		this.progressBar
			.clear()
			.fillStyle(0x222222)
			.fillRectShape(this.progressCompleteRect)
			.fillStyle(color)
			.fillRectShape(this.progressRect)
	}

	onLoadComplete() {
		this.scene.start(SceneKey.LOGIN)
		this.scene.systems.shutdown()
	}
}

export default Loader

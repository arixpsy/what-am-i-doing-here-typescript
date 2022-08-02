import Phaser from 'phaser'
import { BackgroundKey, MapKey, SceneKey, SpriteKey } from '../utils/key'
import SpriteData from '../utils/sprite'
import loginForm from './../assets/html/loginForm.html?raw'
import { v4 as uuidv4 } from 'uuid'
import { PlayerInfo } from '../@types'

class Login extends Phaser.Scene {
	private loginForm?: Phaser.GameObjects.DOMElement

	constructor() {
		super(SceneKey.LOGIN)
	}

	create() {
		this.add.image(500, 250, BackgroundKey.LOGIN_BACKGROUND)

		this.add.rectangle(500, 250, 1000, 500, 0x000000, 0.3)
		this.loginForm = this.add.dom(0, 0).createFromHTML(loginForm)
		this.loginForm.setOrigin(0, 0)
		this.loginForm.addListener('click')

		const spriteInput = document.getElementById(
			'sprite-input'
		) as HTMLSelectElement
		for (const sprite of Object.values(SpriteData)) {
			if (sprite.key !== SpriteKey.PORTAL) {
				spriteInput.innerHTML += `<option value='${sprite.key}'>${sprite.key}</option>`
			}
		}

		this.loginForm.on('click', (event: Event) => {
			if (!(event.target instanceof HTMLInputElement)) return

			const displayNameInput = document.getElementById(
				'display-name-input'
			) as HTMLInputElement

			if (event.target.id == 'instantLoginBtn') {
				const playerInfo: PlayerInfo = {
					uid: uuidv4(),
					displayName: displayNameInput.value,
					spriteType: spriteInput.value as SpriteKey,
					channel: 1,
					map: MapKey.FOREST as MapKey,
					portal: 0,
				}
				if (playerInfo.displayName) {
					this.scene.start(playerInfo.map, playerInfo)
				} else {
					alert('Enter a display name')
				}
			}
		})
	}
}

export default Login

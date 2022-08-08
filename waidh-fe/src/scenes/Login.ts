import Phaser from 'phaser'
import {
	BackgroundKey,
	MapKey,
	SceneKey,
	SoundKey,
	SpriteKey,
} from '../utils/key'
import SpriteData from '../utils/sprite'
import loginForm from './../assets/html/loginForm.html?raw'
import { v4 as uuidv4 } from 'uuid'
import { LoginInfo, PlayerInfo } from '../@types'
import io, { Socket } from 'socket.io-client'
import { SocketEvent } from '../utils/socket'
import { z } from 'zod'
import Cookies from 'js-cookie'
import { SettingKey } from '../utils/key'
import { initVolume } from '../utils/functions/volume'

class Login extends Phaser.Scene {
	private loginForm?: Phaser.GameObjects.DOMElement
	private bgm?: Phaser.Sound.BaseSound

	constructor() {
		super(SceneKey.LOGIN)
	}

	create() {
		const io: Socket = this.registry.get('socket')
		const soundManager = this.sound as Phaser.Sound.HTML5AudioSoundManager
		
		// Initialize Background
		this.add.image(500, 250, BackgroundKey.LOGIN_BACKGROUND)

		// Initialize Sound
		initVolume(soundManager)
		this.bgm = soundManager.add(SoundKey.LOGIN, { loop: true})
		this.bgm.play()

		// Initialize Login UI
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
			if (!(event.target instanceof HTMLButtonElement)) return

			const displayNameInput = document.getElementById(
				'display-name-input'
			) as HTMLInputElement

			if (event.target.id == 'instantLoginBtn') {
				io.auth = <LoginInfo>{
					uid: uuidv4(),
					displayName: displayNameInput.value,
					spriteType: spriteInput.value as SpriteKey,
				}

				if (!io.auth.displayName) {
					alert('Enter a display name')
					return
				}

				io.connect()

				io.on('connect_error', (err: any) => {
					if (err instanceof z.ZodError) {
						for (const issue of err.issues) {
							const zodIssue = issue as z.ZodIssue
							console.debug(
								`${zodIssue.path[zodIssue.path.length - 1]}: ${
									zodIssue.message
								}`
							)
						}
					} else {
						console.debug(err)
					}
				})

				io.on(SocketEvent.LOGIN_SUCCESS, (data: PlayerInfo) => {
					document.getElementById('login-form-container')?.classList.add('fade')
					this.cameras.main.fadeOut(750, 0, 0, 0)
					this.cameras.main.once('camerafadeoutcomplete', () => {
						this.scene.start(data.map)
						this.bgm?.stop()
						this.scene.stop()
					})
				})
			}
		})
	}
}

export default Login

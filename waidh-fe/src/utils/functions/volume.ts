import Cookies from 'js-cookie'
import { SettingKey } from '../key'

export function initVolume(soundManager: Phaser.Sound.HTML5AudioSoundManager) {
	const savedVolumeSettings = Cookies.get(SettingKey.SOUND_VOLUME)

	if (savedVolumeSettings) {
		soundManager.setVolume(parseFloat(savedVolumeSettings))
	} else {
		soundManager.setVolume(0.5)
		Cookies.set(SettingKey.SOUND_VOLUME, (0.5).toString())
	}
}

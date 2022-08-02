import { SoundKey } from './key'
import titleAudio from './../assets/sounds/title.mp3'

type SoundDataShape = {
  key: SoundKey,
  audio: string,
}

const SoundData: Record<SoundKey, SoundDataShape> = {
	[SoundKey.LOGIN]: {
		key: SoundKey.LOGIN,
		audio: titleAudio,
	},
}

export default SoundData

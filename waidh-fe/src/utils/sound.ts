import { SoundKey } from './key'
import titleAudio from './../assets/sounds/title.mp3'
import cavaBienAudio from './../assets/sounds/CavaBien.mp3'

type SoundDataShape = {
	key: SoundKey
	audio: string
}

const SoundData: Record<SoundKey, SoundDataShape> = {
	[SoundKey.LOGIN]: {
		key: SoundKey.LOGIN,
		audio: titleAudio,
	},
	[SoundKey.CAVA_BIEN]: {
		key: SoundKey.CAVA_BIEN,
		audio: cavaBienAudio,
	},
}

export default SoundData

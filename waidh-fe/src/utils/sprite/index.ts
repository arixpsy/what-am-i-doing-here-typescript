import { SpriteKey } from '../key'
import PinkBeanData from './pinkBean'
import PortalData from './portal'

export type SpriteDataShape = {
	dimensions: {
		height: number
		width: number
	}
	idle: {
		spriteSheet: string
		key: string
		framerate: number
	}
	moving?: {
		spriteSheet: string
		key: string
		framerate: number
	}
	key: SpriteKey
}

const SpriteData: Record<SpriteKey, SpriteDataShape> = {
	[SpriteKey.PINK_BEAN]: PinkBeanData,
	[SpriteKey.PORTAL]: PortalData,
}

export default SpriteData

import { SpriteDataShape } from '.'
import { SpriteKey } from '../key'
import portalIdle from './../../assets/sprites/portal/portal.png'

const PortalData: SpriteDataShape = {
	dimensions: {
		height: 122,
		width: 127,
	},
	idle: {
		spriteSheet: portalIdle,
		key: 'PORTAL_IDLE',
		framerate: 6,
	},
	key: SpriteKey.PORTAL,
}

export default PortalData

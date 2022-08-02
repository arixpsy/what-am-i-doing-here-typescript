import { SpriteDataShape } from '.'
import { SpriteKey } from '../key'
import pinkBeanIdle from './../../assets/sprites/pinkBean/pink-bean-idle.png'
import pinkBeanMoving from './../../assets/sprites/pinkBean/pink-bean-moving.png'

const PinkBeanData: SpriteDataShape = {
	dimensions: {
		height: 100,
		width: 100,
	},
	idle: {
		spriteSheet: pinkBeanIdle,
		key: 'PINK_BEAN_IDLE',
		framerate: 4,
	},
	moving: {
		spriteSheet: pinkBeanMoving,
		key: 'PINK_BEAN_MOVING',
		framerate: 7,
	},
	key: SpriteKey.PINK_BEAN,
}

export default PinkBeanData

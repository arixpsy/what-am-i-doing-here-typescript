import { SceneKey, SpriteKey } from '../utils/key'

export type PlayerInfo = {
	uid: string
	displayName: string
	spriteType: SpriteKey
	channel: number
	map: SceneKey
	portal: number
}

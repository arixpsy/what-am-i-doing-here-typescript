import { SpriteState } from '../objects/player'
import { MapKey, SceneKey, SpriteKey } from '../utils/key'

export type LoginInfo = {
	uid: string
	displayName: string
	spriteType: SpriteKey
}

export type PlayerInfo = {
	socketId: string
	uid: string
	displayName: string
	spriteType: SpriteKey
	channel: number
	map: MapKey
	portal?: number
}

export type PlayerInfoWithXY = PlayerInfo & {
	x?: number,
	y?: number
}

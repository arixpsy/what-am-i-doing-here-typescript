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

// export type SocketPlayerConnectedMessageBody = {
// 	socketId: string
// 	uid: string
// 	displayName: string
// 	spriteType: SpriteKey
// 	channel: number
// 	map: MapKey
// 	portal: number
// 	x?: number
// 	y?: number
// }

// export type SocketPlayersMessageBody = {
// 	players: Record<string, SocketPlayerConnectedMessageBody>
// 	games: Record<
// 		string,
// 		{
// 			id: string
// 			host: {
// 				uid: string
// 				displayName: string
// 				socketId: string
// 			}
// 			gameType: number // TODO:
// 			players: Array<{}>
// 			gameState: string // TODO:
// 			gameData: {
// 				hostAction: null
// 				playerAction: null
// 			}
// 			map: MapKey
// 			channel: number
// 		}
// 	>
// }

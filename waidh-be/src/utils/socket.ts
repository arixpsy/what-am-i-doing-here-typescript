import z from 'zod'
import { MapKey, SpriteKey } from './constants'

export enum SocketEvent {
	// TO SERVER
	CONNECTED = 'connection',
	DISCONNECT = 'disconnect',
	LOGIN_SUCCESS = 'login_success',
	JOIN_MAP = 'join_map',
	REQUEST_ALL_PLAYERS = 'request_all_players',
	CLIENT_MOVEMENT = 'client_movement',
	CLIENT_MOVEMENT_STOP = 'client_movement_stop',

	// TO CLIENT
	PLAYER_CONNECT = 'player_connect',
	PLAYER_DISCONNECT = 'player_disconnect',
	PLAYER_MOVE = 'player_move',
	PLAYER_STOP = 'player_stop',
}

export const ZLoginSchema = z.object({
	uid: z.string(),
	displayName: z.string(),
	spriteType: z.nativeEnum(SpriteKey),
})

export type ILogin = z.infer<typeof ZLoginSchema>

export const ZPlayerInfoSchema = ZLoginSchema.extend({
	socketId: z.string(),
	channel: z.number(),
	map: z.nativeEnum(MapKey),
	portal: z.optional(z.number()),
})

export type IPlayerInfo = z.infer<typeof ZPlayerInfoSchema>

export const ZPlayerInfoWithXYSchema = ZPlayerInfoSchema.extend({
	x: z.optional(z.number()),
	y: z.optional(z.number()),
})

export type IPlayerInfoWithXY = z.infer<typeof ZPlayerInfoWithXYSchema>

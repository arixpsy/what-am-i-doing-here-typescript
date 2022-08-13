import { Server } from 'socket.io'
import { MapKey } from './utils/constants'
import {
	ILogin,
	IPlayerInfoWithXY,
	SocketEvent,
	ZLoginSchema,
} from './utils/socket'
import Storage from './storage'
import { getRoomId } from './utils/functions/storage'

const gameStorage = new Storage()

const socket = (io: Server) => {
	io.use((socket, next) => {
		const login = socket.handshake.auth
		try {
			ZLoginSchema.parse(login)
		} catch (err) {
			return next(new Error(JSON.stringify(err)))
		}
		next()
	})

	io.on(SocketEvent.CONNECTED, (socket) => {
		const playerInfo: IPlayerInfoWithXY = {
			...(socket.handshake.auth as ILogin),
			socketId: socket.id,
			channel: 1,
			map: MapKey.FOREST,
		}

		socket.join(getRoomId(playerInfo.map, playerInfo.channel))

		console.log(`🟢 A user connected: ${playerInfo.displayName}`)
		console.log(`🟢 A user join room: ${getRoomId(playerInfo.map, playerInfo.channel)}`)

		io.to(socket.id).emit(SocketEvent.LOGIN_SUCCESS, playerInfo)

		socket.on(
			SocketEvent.JOIN_MAP,
			(_: any, callback: (res: IPlayerInfoWithXY) => void) => {
				console.log(
					`🟢 A user join map(${playerInfo.map}): ${playerInfo.displayName}`
				)
				const newRoomId = getRoomId(playerInfo.map, playerInfo.channel)
				const newPlayer = gameStorage.addPlayerToRoom(playerInfo)
				socket.broadcast.to(newRoomId).emit(SocketEvent.PLAYER_CONNECT, newPlayer)
				callback(playerInfo)
			}
		)

		socket.on(SocketEvent.DISCONNECT, function () {
			console.log(`⛔ A user disconnected: ${playerInfo.displayName}`)
			const newRoomId = getRoomId(playerInfo.map, playerInfo.channel)
			const removedPlayer = gameStorage.removePlayer(playerInfo)
			socket.broadcast
				.to(newRoomId)
				.emit(SocketEvent.PLAYER_DISCONNECT, removedPlayer)
		})

		socket.on(
			SocketEvent.REQUEST_ALL_PLAYERS,
			(_: any, callback: (res: Record<string, IPlayerInfoWithXY>) => void) => {
				const { map, channel } = playerInfo
				const allPlayers = gameStorage.getPlayersInRoom(map, channel)
				callback(allPlayers)
			}
		)

		socket.on(
			SocketEvent.CLIENT_MOVEMENT,
			({ x, y }: Pick<IPlayerInfoWithXY, 'uid' | 'x' | 'y'>) => {
				const roomId = getRoomId(playerInfo.map, playerInfo.channel)
				playerInfo.x = x
				playerInfo.y = y
				gameStorage.updatePlayerLocation(playerInfo)
				socket.broadcast.to(roomId).emit(SocketEvent.PLAYER_MOVE, playerInfo)
			}
		)

		socket.on(
			SocketEvent.CLIENT_MOVEMENT_STOP,
			({ x, y }: Pick<IPlayerInfoWithXY, 'uid' | 'x' | 'y'>) => {
				const roomId = getRoomId(playerInfo.map, playerInfo.channel)
				playerInfo.x = x
				playerInfo.y = y
				gameStorage.updatePlayerLocation(playerInfo)
				socket.broadcast.to(roomId).emit(SocketEvent.PLAYER_STOP, playerInfo)
			}
		)

		socket.on(
			SocketEvent.CHANGE_MAP,
			(
				{ map, portal }: Pick<IPlayerInfoWithXY, 'map' | 'portal'>,
				callback: Function
			) => {
				const currentRoomId = getRoomId(playerInfo.map, playerInfo.channel)
				const oldPlayerData = gameStorage.removePlayer(playerInfo)

				playerInfo.map = map
				playerInfo.portal = portal
				delete playerInfo.x
				delete playerInfo.y
				const newRoomId = getRoomId(playerInfo.map, playerInfo.channel)

				socket.broadcast
					.to(currentRoomId)
					.emit(SocketEvent.PLAYER_DISCONNECT, oldPlayerData)
				socket.leave(currentRoomId)
				console.log(`🟡 A user leave room: ${currentRoomId}`)
				socket.join(newRoomId)
				console.log(`🟢 A user join room: ${newRoomId}`)
				callback()
			}
		)
	})
}

export default socket

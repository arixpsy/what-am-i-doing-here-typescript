import { Server } from 'socket.io'
import { MapKey } from './utils/constants'
import {
	ILogin,
	IPlayerInfoWithXY,
	SocketEvent,
	ZLoginSchema,
} from './utils/socket'
import Storage from './storage'

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
		const roomId = `${playerInfo.map}-${playerInfo.channel}`
		socket.join(roomId)

		console.log('A user connected: ' + playerInfo.uid)
		console.log('A user join room: ' + roomId)

		io.to(socket.id).emit(SocketEvent.LOGIN_SUCCESS, playerInfo)

		socket.on(
			SocketEvent.JOIN_MAP,
			(_: any, callback: (res: IPlayerInfoWithXY) => void) => {
				console.log('A user join map:' + playerInfo.uid)
				const newPlayer = gameStorage.addPlayerToRoom(playerInfo)
				socket.broadcast.to(roomId).emit(SocketEvent.PLAYER_CONNECT, newPlayer)
				callback(playerInfo)
			}
		)

		socket.on(SocketEvent.DISCONNECT, function () {
			console.log('A user disconnected: ' + playerInfo.uid)
			const removedPlayer = gameStorage.removePlayer(playerInfo)
			socket.broadcast
				.to(roomId)
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

		socket.on(SocketEvent.CLIENT_MOVEMENT, ({ x, y }: Pick<IPlayerInfoWithXY, 'uid' | 'x' | 'y'>) => {
			playerInfo.x = x
			playerInfo.y = y
			gameStorage.updatePlayerLocation(playerInfo)
			socket.broadcast.to(roomId).emit(SocketEvent.PLAYER_MOVE, playerInfo);
		})

		socket.on(SocketEvent.CLIENT_MOVEMENT_STOP, ({ x, y }: Pick<IPlayerInfoWithXY, 'uid' | 'x' | 'y'>) => {
			playerInfo.x = x
			playerInfo.y = y
			gameStorage.updatePlayerLocation(playerInfo)
			socket.broadcast.to(roomId).emit(SocketEvent.PLAYER_STOP, playerInfo);
		})
	})
}

export default socket

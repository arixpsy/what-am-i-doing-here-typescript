import { Server } from 'socket.io'
import { MapKey } from './utils/constants'
import { map } from 'zod'
import { ILogin, IPlayerInfo, SocketEvent, ZLoginSchema } from './utils/socket'

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
		const playerInfo: IPlayerInfo = {
			...(socket.handshake.auth as ILogin),
			socketId: socket.id,
			channel: 1,
			map: MapKey.FOREST,
			portal: 0,
		}
		const roomId = `${playerInfo.map}-${playerInfo.channel}`
		socket.join(roomId)

		console.log('A user connected: ' + playerInfo.uid)
		console.log('A user join room: ' + roomId)

		io.to(socket.id).emit(SocketEvent.LOGIN_SUCCESS, playerInfo)

		socket.on(SocketEvent.JOIN_MAP, async () => {})

		socket.on(SocketEvent.DISCONNECT, async function () {
			console.log('A user disconnected: ' + playerInfo.uid)
		})
	})
}

export default socket

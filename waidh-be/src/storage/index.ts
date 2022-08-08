import { MapKey } from '../utils/constants'
import { getRoomId } from '../utils/functions/storage'
import { IPlayerInfoWithXY } from '../utils/socket'

let instance: Storage

class Storage {
	private players: Record<string, Record<string, IPlayerInfoWithXY>>

	constructor() {
		if (instance) {
			throw new Error('Should not create multiple storage instance')
		}
		instance = this
		this.players = {}
	}

	getPlayersInRoom(map: MapKey, channel: number) {
		const roomId = getRoomId(map, channel)
		const playersInRoom = this.players[roomId] || {}
		return playersInRoom
	}

	addPlayerToRoom(playerInfo: IPlayerInfoWithXY): IPlayerInfoWithXY{
    const { map, channel } = playerInfo
		const roomId = getRoomId(map, channel)
		const playersInRoom = this.getPlayersInRoom(map, channel)
		playersInRoom[playerInfo.uid] = playerInfo
		this.players[roomId] = playersInRoom
    return playerInfo
	}

	removePlayer(playerInfo: IPlayerInfoWithXY): IPlayerInfoWithXY {
    const { map, channel, uid } = playerInfo
		const roomId = getRoomId(map, channel)
    const playersInRoom = this.getPlayersInRoom(map, channel)
		const removePlayer = { ...playersInRoom[uid] }
		delete playersInRoom[uid]
		this.players[roomId] = playersInRoom
		return removePlayer
	}
}

export default Storage

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const storage_1 = require("../utils/functions/storage");
let instance;
class Storage {
    players;
    constructor() {
        if (instance) {
            throw new Error('Should not create multiple storage instance');
        }
        instance = this;
        this.players = {};
    }
    getPlayersInRoom(map, channel) {
        const roomId = (0, storage_1.getRoomId)(map, channel);
        const playersInRoom = this.players[roomId] || {};
        return playersInRoom;
    }
    addPlayerToRoom(playerInfo) {
        const { map, channel } = playerInfo;
        const roomId = (0, storage_1.getRoomId)(map, channel);
        const playersInRoom = this.getPlayersInRoom(map, channel);
        playersInRoom[playerInfo.uid] = { ...playerInfo };
        this.players[roomId] = playersInRoom;
        return { ...playerInfo };
    }
    removePlayer(playerInfo) {
        const { map, channel, uid } = playerInfo;
        const roomId = (0, storage_1.getRoomId)(map, channel);
        const playersInRoom = this.getPlayersInRoom(map, channel);
        const removePlayer = { ...playersInRoom[uid] };
        delete playersInRoom[uid];
        this.players[roomId] = playersInRoom;
        return removePlayer;
    }
    updatePlayerLocation(playerInfo) {
        const { map, channel, uid, x, y } = playerInfo;
        const playersInRoom = this.getPlayersInRoom(map, channel);
        playersInRoom[uid].x = x;
        playersInRoom[uid].y = y;
    }
}
exports.default = Storage;

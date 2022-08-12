"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("./utils/constants");
const socket_1 = require("./utils/socket");
const storage_1 = __importDefault(require("./storage"));
const storage_2 = require("./utils/functions/storage");
const gameStorage = new storage_1.default();
const socket = (io) => {
    io.use((socket, next) => {
        const login = socket.handshake.auth;
        try {
            socket_1.ZLoginSchema.parse(login);
        }
        catch (err) {
            return next(new Error(JSON.stringify(err)));
        }
        next();
    });
    io.on(socket_1.SocketEvent.CONNECTED, (socket) => {
        const playerInfo = {
            ...socket.handshake.auth,
            socketId: socket.id,
            channel: 1,
            map: constants_1.MapKey.FOREST,
        };
        const roomId = `${playerInfo.map}-${playerInfo.channel}`;
        socket.join(roomId);
        console.log(`🟢 A user connected: ${playerInfo.displayName}`);
        console.log(`🟢 A user join room: ${roomId}`);
        io.to(socket.id).emit(socket_1.SocketEvent.LOGIN_SUCCESS, playerInfo);
        socket.on(socket_1.SocketEvent.JOIN_MAP, (_, callback) => {
            console.log(`🟢 A user join map(${playerInfo.map}): ${playerInfo.displayName}`);
            const newPlayer = gameStorage.addPlayerToRoom(playerInfo);
            socket.broadcast.to(roomId).emit(socket_1.SocketEvent.PLAYER_CONNECT, newPlayer);
            callback(playerInfo);
        });
        socket.on(socket_1.SocketEvent.DISCONNECT, function () {
            console.log(`⛔ A user disconnected: ${playerInfo.displayName}`);
            const removedPlayer = gameStorage.removePlayer(playerInfo);
            socket.broadcast
                .to(roomId)
                .emit(socket_1.SocketEvent.PLAYER_DISCONNECT, removedPlayer);
        });
        socket.on(socket_1.SocketEvent.REQUEST_ALL_PLAYERS, (_, callback) => {
            const { map, channel } = playerInfo;
            const allPlayers = gameStorage.getPlayersInRoom(map, channel);
            callback(allPlayers);
        });
        socket.on(socket_1.SocketEvent.CLIENT_MOVEMENT, ({ x, y }) => {
            playerInfo.x = x;
            playerInfo.y = y;
            gameStorage.updatePlayerLocation(playerInfo);
            socket.broadcast.to(roomId).emit(socket_1.SocketEvent.PLAYER_MOVE, playerInfo);
        });
        socket.on(socket_1.SocketEvent.CLIENT_MOVEMENT_STOP, ({ x, y }) => {
            playerInfo.x = x;
            playerInfo.y = y;
            gameStorage.updatePlayerLocation(playerInfo);
            socket.broadcast.to(roomId).emit(socket_1.SocketEvent.PLAYER_STOP, playerInfo);
        });
        socket.on(socket_1.SocketEvent.CHANGE_MAP, ({ map, portal }, callback) => {
            const currentRoomId = (0, storage_2.getRoomId)(playerInfo.map, playerInfo.channel);
            const oldPlayerData = gameStorage.removePlayer(playerInfo);
            playerInfo.map = map;
            playerInfo.portal = portal;
            delete playerInfo.x;
            delete playerInfo.y;
            const newRoomId = (0, storage_2.getRoomId)(playerInfo.map, playerInfo.channel);
            socket.broadcast
                .to(currentRoomId)
                .emit(socket_1.SocketEvent.PLAYER_DISCONNECT, oldPlayerData);
            socket.leave(currentRoomId);
            console.log(`🟡 A user leave room: ${currentRoomId}`);
            socket.join(newRoomId);
            console.log(`🟢 A user join room: ${newRoomId}`);
            callback();
        });
    });
};
exports.default = socket;

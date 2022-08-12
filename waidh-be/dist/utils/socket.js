"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZPlayerInfoWithXYSchema = exports.ZPlayerInfoSchema = exports.ZLoginSchema = exports.SocketEvent = void 0;
const zod_1 = __importDefault(require("zod"));
const constants_1 = require("./constants");
var SocketEvent;
(function (SocketEvent) {
    // TO SERVER
    SocketEvent["CONNECTED"] = "connection";
    SocketEvent["DISCONNECT"] = "disconnect";
    SocketEvent["LOGIN_SUCCESS"] = "login_success";
    SocketEvent["JOIN_MAP"] = "join_map";
    SocketEvent["REQUEST_ALL_PLAYERS"] = "request_all_players";
    SocketEvent["CLIENT_MOVEMENT"] = "client_movement";
    SocketEvent["CLIENT_MOVEMENT_STOP"] = "client_movement_stop";
    SocketEvent["CHANGE_MAP"] = "change_map";
    // TO CLIENT
    SocketEvent["PLAYER_CONNECT"] = "player_connect";
    SocketEvent["PLAYER_DISCONNECT"] = "player_disconnect";
    SocketEvent["PLAYER_MOVE"] = "player_move";
    SocketEvent["PLAYER_STOP"] = "player_stop";
})(SocketEvent = exports.SocketEvent || (exports.SocketEvent = {}));
exports.ZLoginSchema = zod_1.default.object({
    uid: zod_1.default.string(),
    displayName: zod_1.default.string(),
    spriteType: zod_1.default.nativeEnum(constants_1.SpriteKey),
});
exports.ZPlayerInfoSchema = exports.ZLoginSchema.extend({
    socketId: zod_1.default.string(),
    channel: zod_1.default.number(),
    map: zod_1.default.nativeEnum(constants_1.MapKey),
    portal: zod_1.default.optional(zod_1.default.number()),
});
exports.ZPlayerInfoWithXYSchema = exports.ZPlayerInfoSchema.extend({
    x: zod_1.default.optional(zod_1.default.number()),
    y: zod_1.default.optional(zod_1.default.number()),
});

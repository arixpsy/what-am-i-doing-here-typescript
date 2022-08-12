"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const socket_io_1 = require("socket.io");
require("dotenv/config");
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const socket_1 = __importDefault(require("./socket"));
const constants_1 = require("./utils/constants");
const config_1 = require("./config");
const env = process.env.ENV || constants_1.Environment.DEV;
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: config_1.CORS_ORIGIN[env],
        credentials: true,
    },
});
app.use((0, cors_1.default)({
    origin: config_1.CORS_ORIGIN[env],
}));
app.get('/', (_, res) => {
    res.send('Express + Socket.io + TypeScript Server');
});
server.listen(port, () => {
    console.log(`⚡️[server]: Server(${env}) is running at https://localhost:${port}`);
    (0, socket_1.default)(io);
});

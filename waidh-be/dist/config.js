"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CORS_ORIGIN = void 0;
const constants_1 = require("./utils/constants");
exports.CORS_ORIGIN = {
    [constants_1.Environment.DEV]: ["http://localhost:8080"],
    [constants_1.Environment.PROD]: [],
};

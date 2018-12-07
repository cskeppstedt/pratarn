"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("winston");
const consoleTransport = new winston_1.transports.Console({
    handleExceptions: true,
    format: winston_1.format.combine(winston_1.format.colorize(), winston_1.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), winston_1.format.printf((info) => `${info.timestamp} [${info.level}] - ${info.message}`))
});
exports.default = winston_1.createLogger({
    level: process.env.LOG_LEVEL || "verbose",
    transports: [consoleTransport]
});

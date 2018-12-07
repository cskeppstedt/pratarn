"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_io_1 = __importDefault(require("discord.io"));
const handlers_1 = __importDefault(require("./handlers"));
const logger_1 = __importDefault(require("./utils/logger"));
require("dotenv").config();
const discordAuthToken = process.env.DISCORD_AUTH_TOKEN || "";
if (!discordAuthToken) {
    console.error("DISCORD_AUTH_TOKEN not defined");
    process.exit(1);
}
const bot = new discord_io_1.default.Client({ token: discordAuthToken });
bot.on("ready", () => {
    logger_1.default.info(`[bot] connected - logged in as: ${bot.username} - id: ${bot.id}`);
});
bot.on("message", (user, userID, channelID, message, evt) => {
    logger_1.default.verbose(`[bot] message event - user: ${user} - userID: ${userID} - channelID: ${channelID}` +
        ` - message: ${message} - evt: ${JSON.stringify(evt)}`);
    const channelMessage = { user, userID, channelID, message, evt };
    const applicableHandlers = handlers_1.default.filter((handler) => handler.applicable(bot, logger_1.default, channelMessage));
    if (applicableHandlers.length > 0) {
        applicableHandlers.forEach((handler) => {
            logger_1.default.verbose(`[bot] running handler: ${handler.command}`);
            handler.process(bot, logger_1.default, channelMessage);
        });
    }
});
bot.on("disconnect", (errMsg, code) => {
    logger_1.default.info(`[bot] disconnected - error: ${errMsg} - code ${code}`);
});
logger_1.default.info(`[bot] handlers: ${handlers_1.default.map((h) => h.command).join(", ")}`);
logger_1.default.info("[bot] attempting to connect");
bot.connect();
// handle program shutdown
process.stdin.resume();
function exitHandler(code) {
    logger_1.default.info(`[bot] shutdown requested, disconnecting - code: ${code}`);
    try {
        bot.disconnect();
    }
    catch (_a) { }
    process.exit();
}
process.on("exit", exitHandler.bind(null));
process.on("SIGINT", exitHandler.bind(null));
process.on("SIGUSR1", exitHandler.bind(null));
process.on("SIGUSR2", exitHandler.bind(null));
process.on("uncaughtException", exitHandler.bind(null));

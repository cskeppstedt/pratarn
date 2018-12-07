"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const is_bot_1 = __importDefault(require("../utils/is_bot"));
exports.default = {
    command: "!carlsucks",
    description: "the core functionality that shall never be removed",
    applicable: (bot, logger, channelMessage) => /!carlsucks/.test(channelMessage.message) && !is_bot_1.default(channelMessage),
    process: (bot, logger, { channelID, evt }) => {
        logger.verbose(`[carlsucks] responding to message ${evt.d.id}`);
        bot.sendMessage({ message: "HEJ på dig din jävel!", to: channelID });
    }
};

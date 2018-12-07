"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const is_bot_1 = __importDefault(require("../utils/is_bot"));
const describeCommands = (handlers) => "Available commands:\n\n" +
    handlers
        .map(({ command, description }) => `**${command}**\n${description}`)
        .join("\n\n");
exports.default = (handlers) => ({
    command: "!help",
    description: "displays a list of commands and their description",
    applicable: (bot, logger, channelMessage) => (/!help/.test(channelMessage.message) ||
        /!pratarn/.test(channelMessage.message)) &&
        !is_bot_1.default(channelMessage),
    process: (bot, logger, { channelID, message, evt }) => __awaiter(this, void 0, void 0, function* () {
        logger.verbose(`[help] responding to message ${evt.d.id} `);
        bot.sendMessage({
            message: describeCommands(handlers),
            to: channelID
        });
    })
});

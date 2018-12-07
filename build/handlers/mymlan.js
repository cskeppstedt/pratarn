"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const is_bot_1 = __importDefault(require("../utils/is_bot"));
const repeat_1 = __importDefault(require("../utils/repeat"));
const asciiChatBubble = (chatBubbleMessage) => [
    " " + repeat_1.default("_", chatBubbleMessage.length + 2),
    `( ${chatBubbleMessage} )`,
    " " + repeat_1.default("-", chatBubbleMessage.length + 2),
    "    o",
    "     o"
].join("\n");
const asciiDogMessage = (chatBubbleMessage) => [
    "```",
    chatBubbleMessage && chatBubbleMessage.length > 0
        ? asciiChatBubble(chatBubbleMessage)
        : "",
    "        ''',",
    '     o_)O )____)"',
    "      \\_        )",
    "Veoff!  '',,,,,,",
    "          ||  ||",
    '         "--\'"--\'"',
    "",
    "```"
].join("\n");
exports.default = {
    command: "!mymlan",
    description: "shows the inner thoughts of the mymmel",
    applicable: (bot, logger, channelMessage) => /!mymlan/.test(channelMessage.message) && !is_bot_1.default(channelMessage),
    process: (bot, logger, { channelID, message, evt }) => {
        const chatBubbleMessage = message.substring("!mymlan ".length);
        logger.verbose(`[mymlan] responding to message ${evt.d.id} `);
        bot.sendMessage({
            message: asciiDogMessage(chatBubbleMessage),
            to: channelID
        });
    }
};

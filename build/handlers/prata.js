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
const build_1 = __importDefault(require("../markov/build"));
const generate_1 = __importDefault(require("../markov/generate"));
const tokenize_1 = __importDefault(require("../markov/tokenize"));
const dynamo_1 = require("../utils/dynamo");
const is_bot_1 = __importDefault(require("../utils/is_bot"));
const normalize_username_1 = __importDefault(require("../utils/normalize_username"));
const random_int_1 = __importDefault(require("../utils/random_int"));
const should_record_message_1 = __importDefault(require("../utils/should_record_message"));
const to_storage_message_view_1 = __importDefault(require("../utils/to_storage_message_view"));
const shouldRespond = (channelMessage) => /^!prata .+/.test(channelMessage.message);
const makeMessageCorpus = (messages) => messages.map((message) => message.content).join("\n");
const makeResponse = (logger, username) => __awaiter(this, void 0, void 0, function* () {
    const { messageObjects } = yield dynamo_1.fetchMessageObjectsCached(normalize_username_1.default(username));
    if (messageObjects.length === 0) {
        return `sry känner inte igen **${username}** :(  testa annat username?`;
    }
    const corpus = makeMessageCorpus(messageObjects);
    const numWords = 8 + random_int_1.default(5);
    const numSentences = 4;
    const prefixLength = 2;
    const tokens = tokenize_1.default(corpus);
    const map = build_1.default(tokens, prefixLength);
    logger.verbose(`[prata] markov params for ${username} - ${messageObjects.length} messages - ${numWords} words - ${numSentences} sentences - ${prefixLength} prefix length - ${tokens.length} tokens - ${map.keys().length} map keys - ${map.keys()}`);
    const generatedMessages = [`**${username}:**`];
    for (let i = 0; i < numSentences; i++) {
        generatedMessages.push(generate_1.default(random_int_1.default, map, numWords, true));
    }
    return generatedMessages.join("\n\n");
});
const respond = (bot, logger, { channelID, message, evt }) => __awaiter(this, void 0, void 0, function* () {
    try {
        const targetUserName = message.substring("!prata ".length);
        const responseMessage = yield makeResponse(logger, targetUserName);
        logger.verbose(`[prata] responding to message ${evt.d.id} for username ${targetUserName}`);
        bot.sendMessage({ message: responseMessage, to: channelID });
    }
    catch (err) {
        logger.error(`[prata] error occurred, possible throttling - ${err}`);
        console.error(err);
    }
});
const recordMessage = (bot, logger, channelMessage) => {
    const messageView = to_storage_message_view_1.default(channelMessage.evt.d);
    logger.verbose(`[prata] recording message - ${messageView.id}`);
    dynamo_1.insertMessageObject(messageView);
};
exports.default = {
    command: "!prata",
    description: "generate markov chain text for a username, e.g.: !prata skepparn",
    applicable: (bot, logger, channelMessage) => (shouldRespond(channelMessage) ||
        should_record_message_1.default(channelMessage.evt.d)) &&
        !is_bot_1.default(channelMessage),
    process: (bot, logger, channelMessage) => {
        if (shouldRespond(channelMessage)) {
            respond(bot, logger, channelMessage);
        }
        else if (should_record_message_1.default(channelMessage.evt.d)) {
            recordMessage(bot, logger, channelMessage);
        }
    }
};

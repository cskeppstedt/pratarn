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
const chunk_1 = __importDefault(require("./chunk"));
const dynamo_1 = require("./dynamo");
const logger_1 = __importDefault(require("./logger"));
const should_record_message_1 = __importDefault(require("./should_record_message"));
const to_storage_message_view_1 = __importDefault(require("./to_storage_message_view"));
const fetchMessages = (bot, channelId, before) => {
    return new Promise((resolve, reject) => {
        bot.getMessages({ before, channelID: channelId, limit: 100 }, (err, response) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(response);
            }
        });
    });
};
const insertBatch = (messages, batchId) => __awaiter(this, void 0, void 0, function* () {
    logger_1.default.info(`[crawl] inserting batch ${batchId} - ${messages.length} items`);
    try {
        const result = yield dynamo_1.insertMessageObjects(messages);
        logger_1.default.info(`[crawl] batch ${batchId} successful`);
    }
    catch (err) {
        logger_1.default.error(`[crawl] batch ${batchId} failed`);
        console.info("messages in batch:");
        console.info(messages);
        throw err;
    }
});
const batchMessages = (messages) => {
    return chunk_1.default(messages, 25);
};
const nextBefore = (messages) => {
    return messages.reduce((minMessage, message) => message.timestamp < minMessage.timestamp ? message : minMessage, messages[0]).id;
};
exports.default = (bot, channelId, before) => __awaiter(this, void 0, void 0, function* () {
    logger_1.default.info("[crawl] starting");
    while (true) {
        logger_1.default.info(`[crawl] fetching messages in channel ${channelId} before: ${before}`);
        const messages = yield fetchMessages(bot, channelId, before);
        logger_1.default.info(`[crawl] fetch successful, ${messages.length} items`);
        if (messages.length > 0) {
            const filteredMessages = messages
                .filter(should_record_message_1.default)
                .map(to_storage_message_view_1.default);
            if (filteredMessages.length) {
                const batches = batchMessages(filteredMessages);
                logger_1.default.info(`[crawl] inserting ${batches.length} batches - ${filteredMessages.length} messages`);
                yield Promise.all(batches.map(insertBatch));
            }
            else {
                logger_1.default.info("[crawl] no filtered items, skipping insert");
            }
            before = nextBefore(messages);
            logger_1.default.info(`[crawl] nextBefore: ${before}`);
        }
        else {
            logger_1.default.info("[crawl] no more messages, stopping");
            return;
        }
    }
});

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const normalize_username_1 = __importDefault(require("./normalize_username"));
exports.default = (messageObject) => ({
    author_id: messageObject.author.id,
    author_username: normalize_username_1.default(messageObject.author.username),
    channel_id: messageObject.channel_id,
    content: messageObject.content,
    id: messageObject.id,
    timestamp: messageObject.timestamp
});

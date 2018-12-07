"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isBot = (channelMessage) => channelMessage.evt.d.author.bot === true;
exports.default = isBot;

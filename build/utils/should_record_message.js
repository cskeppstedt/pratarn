"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (messageObject) => {
    if (/^!/.test(messageObject.content)) {
        return false;
    }
    if (messageObject.author.bot === true) {
        return false;
    }
    if (messageObject.webhook_id) {
        return false;
    }
    if (messageObject.content === null ||
        messageObject.content === undefined ||
        messageObject.content === "") {
        return false;
    }
    return true;
};

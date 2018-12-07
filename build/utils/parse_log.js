"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const readline_1 = __importDefault(require("readline"));
const RE_EVT = /^{"message":"\[bot\] message event - .* - evt: (.*)","level":"verbose"}$/;
const RE_ESCAPED_QUOTES = /\\"/g;
exports.parseMessageEvents = () => {
    const logPath = path_1.default.join(__dirname, "..", "logs", "pratarn.log");
    return new Promise((resolve, reject) => {
        const messageEvents = [];
        const lineReader = readline_1.default.createInterface({
            input: fs_1.default.createReadStream(logPath)
        });
        lineReader.on("line", (line) => {
            const matches = RE_EVT.exec(line);
            if (matches && matches.length === 2) {
                const evtContent = matches[1].replace(RE_ESCAPED_QUOTES, '"');
                console.info("--evt", evtContent);
                const evt = JSON.parse(evtContent);
                messageEvents.push(evt);
            }
        });
        lineReader.on("close", () => {
            resolve(messageEvents);
        });
    });
};

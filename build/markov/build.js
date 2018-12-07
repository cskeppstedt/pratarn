"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const make_prefix_1 = __importDefault(require("./make-prefix"));
exports.default = (tokens, prefixLength = 2) => {
    tokens = tokens || [];
    const keyMap = {};
    const map = {};
    const keys = [" "];
    const currentPrefix = make_prefix_1.default(prefixLength);
    for (const token of tokens) {
        if (!keyMap[token]) {
            keyMap[token] = true;
            keys.push(token);
        }
        if (!map[currentPrefix.key()]) {
            map[currentPrefix.key()] = [];
        }
        map[currentPrefix.key()].push(token);
        currentPrefix.push(token);
    }
    return {
        keys: () => keys,
        map: () => map,
        prefixLength: () => prefixLength,
        choicesFor: (prefix) => map[prefix.key()] || []
    };
};

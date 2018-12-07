"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DELIMITER = " ";
const makePrefix = (prefixLength, ...initialWords) => {
    if (!prefixLength) {
        throw new Error("Specify a prefix length > 0");
    }
    const prefixTokens = [];
    const push = (word) => {
        prefixTokens.shift();
        prefixTokens.push(word);
    };
    for (let i = 0; i < prefixLength; i++) {
        prefixTokens.push("");
    }
    initialWords.forEach(push);
    return {
        key: () => prefixTokens.join(DELIMITER),
        push
    };
};
exports.fromKey = (key, prefixLength) => {
    const words = key.split(DELIMITER);
    return makePrefix(prefixLength, ...words);
};
exports.default = makePrefix;

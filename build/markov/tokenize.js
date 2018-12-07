"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RE_DELIMITER = /\s/;
const RE_PUNCTUATION = /[?`´'"\[\]().,_]/g;
const isValidWord = (word) => {
    if (word === null || word === undefined || word.trim() === "") {
        return false;
    }
    if (/https?:\/\//g.test(word)) {
        return false;
    }
    if (/```/g.test(word)) {
        return false;
    }
    return true;
};
exports.normalizeWord = (word) => {
    return (word || "")
        .trim()
        .toLowerCase()
        .replace(RE_PUNCTUATION, "");
};
exports.default = (input) => {
    if (input === null || input === undefined || input.trim() === "") {
        return [];
    }
    return input
        .split(/\s/)
        .filter(isValidWord)
        .map(exports.normalizeWord);
};

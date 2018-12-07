"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RE_REPLACE_WHITESPACE = /\s/g;
exports.default = (username) => (username || "")
    .trim()
    .toLowerCase()
    .replace(RE_REPLACE_WHITESPACE, "_");

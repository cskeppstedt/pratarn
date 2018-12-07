"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chunk = (items, chunkSize) => {
    return Array.from(Array(Math.ceil(items.length / chunkSize)), (_, i) => items.slice(i * chunkSize, i * chunkSize + chunkSize));
};
exports.default = chunk;

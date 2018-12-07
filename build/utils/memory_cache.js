"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_cache_1 = __importDefault(require("node-cache"));
const logger_1 = __importDefault(require("./logger"));
class MemoryCache {
    constructor(ttlSeconds) {
        this.cache = new node_cache_1.default({
            stdTTL: ttlSeconds,
            checkperiod: ttlSeconds * 0.2,
            useClones: false
        });
    }
    get(key, storeFunction) {
        const value = this.cache.get(key);
        if (value) {
            logger_1.default.verbose(`[MemoryCache] cache found for ${key}`);
            return Promise.resolve(value);
        }
        logger_1.default.verbose(`[MemoryCache] cache not found for ${key}`);
        return storeFunction().then((result) => {
            logger_1.default.verbose(`[MemoryCache] cache set for ${key}`);
            this.cache.set(key, result);
            return result;
        });
    }
}
exports.default = MemoryCache;

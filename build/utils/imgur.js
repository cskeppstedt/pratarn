"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const isomorphic_fetch_1 = __importDefault(require("isomorphic-fetch"));
const logger_1 = __importDefault(require("./logger"));
const memory_cache_1 = __importDefault(require("./memory_cache"));
const random_int_1 = __importDefault(require("./random_int"));
const cacheKey = (options) => `gallery=${options.subreddit} - sort=${options.sort} - window=${options.window} - page=${options.page}`;
const fetchGallery = ({ subreddit, sort, window, page }) => __awaiter(this, void 0, void 0, function* () {
    logger_1.default.verbose(`[imgur] fetching gallery ${cacheKey({ subreddit, sort, window, page })}`);
    const response = yield isomorphic_fetch_1.default(`https://api.imgur.com/3/gallery/r/${subreddit}/${sort}/${window}/${page}`, { headers: { Authorization: `Client-ID ${process.env.IMGUR_CLIENT_ID}` } });
    if (response.status === 200) {
        const json = yield response.json();
        return json.data;
    }
    else {
        logger_1.default.error(`[imgur] bad response: ${response.status} ${response.statusText}`);
        throw new Error(`bad response: ${response.status} ${response.statusText}`);
    }
});
const galleryCache = new memory_cache_1.default(60 * 60);
exports.randomGalleryImage = ({ subreddit, sort = "time", window = "month", page = 1 }) => __awaiter(this, void 0, void 0, function* () {
    const key = cacheKey({ subreddit, sort, window, page });
    const images = yield galleryCache.get(key, () => fetchGallery({ subreddit, sort, window, page }));
    return images[random_int_1.default(images.length - 1)];
});

"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const make_prefix_1 = __importStar(require("./make-prefix"));
const tokenize_1 = require("./tokenize");
function maxInclusive(choices) {
    return choices.length - 1;
}
function pickChoice(randomInt, choices) {
    return choices[randomInt(maxInclusive(choices))];
}
function pickPrefix(randomInt, map) {
    const choices = Object.keys(map.map());
    const key = pickChoice(randomInt, choices);
    return make_prefix_1.fromKey(key, map.prefixLength());
}
function normalize(word) {
    return /The/.test(word) ? "the" : word;
}
function capitalize(sentence) {
    if (!sentence) {
        return sentence;
    }
    return sentence[0].toUpperCase() + sentence.substring(1);
}
function terminate(sentence) {
    if (!sentence) {
        return "";
    }
    if (/,$/.test(sentence)) {
        return sentence.substring(0, sentence.length - 1) + ".";
    }
    if (/[!?]$/.test(sentence)) {
        return sentence;
    }
    if (!/\.$/.test(sentence)) {
        return sentence + ".";
    }
    return sentence;
}
const forceChoices = (map, prefix, randomInt) => {
    for (let attempts = 0; attempts < 5; attempts++) {
        const choices = map.choicesFor(prefix);
        if (choices.length > 0) {
            return choices;
        }
        prefix = pickPrefix(randomInt, map);
    }
    return [];
};
exports.default = (randomInt, map, numWords, useRandomStart = false) => {
    const prefix = useRandomStart
        ? pickPrefix(randomInt, map)
        : make_prefix_1.default(map.prefixLength());
    const words = [];
    for (let i = 0; i < numWords; i++) {
        // const choices = map.choicesFor(prefix);
        const choices = forceChoices(map, prefix, randomInt);
        if (choices.length === 0) {
            break;
        }
        const word = pickChoice(randomInt, choices);
        prefix.push(word);
        if (words.length === 0) {
            words.push(word);
        }
        else {
            // words.push(normalize(word));
            words.push(tokenize_1.normalizeWord(word));
        }
        if (/\.$/.test(word)) {
            break;
        }
    }
    return terminate(capitalize(words.join(" ")));
};

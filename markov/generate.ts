import { IRandomInt } from "../utils/random_int";
import { IMap } from "./build";
import makePrefix, { fromKey } from "./make-prefix";
import { normalizeWord } from "./tokenize";

function maxInclusive(choices: string[]) {
  return choices.length - 1;
}

function pickChoice(randomInt: IRandomInt, choices: string[]) {
  return choices[randomInt(maxInclusive(choices))];
}

function pickPrefix(randomInt: IRandomInt, map: IMap) {
  const choices = Object.keys(map.map());
  const key = pickChoice(randomInt, choices);
  return fromKey(key, map.prefixLength());
}

function normalize(word: string) {
  return /The/.test(word) ? "the" : word;
}

function capitalize(sentence: string) {
  if (!sentence) {
    return sentence;
  }

  return sentence[0].toUpperCase() + sentence.substring(1);
}

function terminate(sentence: string) {
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

export default (
  randomInt: IRandomInt,
  map: IMap,
  numWords: number,
  useRandomStart = false
) => {
  const prefix = useRandomStart
    ? pickPrefix(randomInt, map)
    : makePrefix(map.prefixLength());

  const words = [];

  for (let i = 0; i < numWords; i++) {
    const choices = map.choicesFor(prefix);

    if (choices.length === 0) {
      break;
    }

    const word = pickChoice(randomInt, choices);
    prefix.push(word);

    if (words.length === 0) {
      words.push(word);
    } else {
      // words.push(normalize(word));
      words.push(normalizeWord(word));
    }

    if (/\.$/.test(word)) {
      break;
    }
  }

  return terminate(capitalize(words.join(" ")));
};

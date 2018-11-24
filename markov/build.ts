import makePrefix, { IPrefix } from "./make-prefix";

export interface IMap {
  keys: () => string[];
  map: () => { [index: string]: string[] };
  prefixLength: () => number;
  choicesFor: (prefix: IPrefix) => string[];
}

export default (tokens: string[], prefixLength = 2) => {
  tokens = tokens || [];

  const keyMap: { [index: string]: boolean } = {};
  const map: { [index: string]: string[] } = {};
  const keys = [" "];
  const currentPrefix = makePrefix(prefixLength);

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
    choicesFor: (prefix: IPrefix) => map[prefix.key()] || []
  } as IMap;
};

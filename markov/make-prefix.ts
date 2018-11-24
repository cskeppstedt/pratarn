const DELIMITER = " ";

export interface IPrefix {
  key: () => string;
  push: (word: string) => void;
}

const makePrefix = (prefixLength: number, ...initialWords: string[]) => {
  if (!prefixLength) {
    throw new Error("Specify a prefix length > 0");
  }

  const prefixTokens: string[] = [];
  const push = (word: string) => {
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
  } as IPrefix;
};

export const fromKey = (key: string, prefixLength: number) => {
  const words = key.split(DELIMITER);
  return makePrefix(prefixLength, ...words);
};

export default makePrefix;

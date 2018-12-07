const RE_DELIMITER = /\s/;
const RE_PUNCTUATION = /[?`´'"\[\]().,_]/g;

const isValidWord = (word: string) => {
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

export const normalizeWord = (word: string) => {
  return (word || "")
    .trim()
    .toLowerCase()
    .replace(RE_PUNCTUATION, "");
};

export default (input: string) => {
  if (input === null || input === undefined || input.trim() === "") {
    return [];
  }

  return input
    .split(/\s/)
    .filter(isValidWord)
    .map(normalizeWord);
};

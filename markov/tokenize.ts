const validWord = (word: string) => {
  if (word === null || word === undefined || word.trim() === "") {
    return false;
  }

  if (/https?:\/\//g.test(word)) {
    return false;
  }

  return true;
};
export default (input: string) => {
  if (!input) {
    return [];
  }

  return input
    .split(/\s/)
    .filter(validWord)
    .map((word) => word.trim());
};

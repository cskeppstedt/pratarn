export default (input: string) => {
  if (!input) {
    return [];
  }

  return input
    .split(/\s/)
    .filter((word) => !!word)
    .map((word) => word.trim());
};

// from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/repeat

export default (str: string, count: number) => {
  count = +count;
  if (count !== count) {
    count = 0;
  }
  if (count < 0) {
    throw new RangeError("repeat count must be non-negative");
  }
  if (count === Infinity) {
    throw new RangeError("repeat count must be less than infinity");
  }
  count = Math.floor(count);
  if (str.length === 0 || count === 0) {
    return "";
  }
  // Ensuring count is a 31-bit integer allows us to heavily optimize the
  // main part. But anyway, most current (August 2014) browsers can't handle
  // strings 1 << 28 chars or longer, so:
  if (str.length * count >= 1 << 28) {
    throw new RangeError("repeat count must not overflow maximum string size");
  }
  const maxCount = str.length * count;
  count = Math.floor(Math.log(count) / Math.log(2));
  while (count) {
    str += str;
    count--;
  }
  str += str.substring(0, maxCount - str.length);
  return str;
};

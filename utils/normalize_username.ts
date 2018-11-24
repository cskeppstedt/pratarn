import { NormalizedUsername } from "../types";

const RE_REPLACE_WHITESPACE = /\s/g;

export default (username: string) =>
  (username || "")
    .trim()
    .toLowerCase()
    .replace(RE_REPLACE_WHITESPACE, "_") as NormalizedUsername;

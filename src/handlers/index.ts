import weeb from "./weeb";
import carlsucks from "./carlsucks";
import dank from "./dank";
import memes from "./memes";
import mymlan from "./mymlan";
import prata from "./prata";
import ree from "./ree";
import { IHandler } from "../types";

const handlers = [dank, memes, weeb, mymlan, prata, carlsucks, ree].reduce(
  (map, handler) => {
    map.set(handler.name, handler);
    return map;
  },
  new Map<string, IHandler>()
);

export default handlers;

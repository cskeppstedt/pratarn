import weeb from "./weeb";
import carlsucks from "./carlsucks";
import dank from "./dank";
import memes from "./memes";
import mymlan from "./mymlan";
import prata from "./prata";
import ree from "./ree";
import { ICommandHandler, IHandler, IMessageHandler } from "../types";

const allHandlers: IHandler[] = [
  dank,
  memes,
  weeb,
  mymlan,
  prata,
  carlsucks,
  ree,
];

const isCommandHandler = (handler: IHandler): handler is ICommandHandler => {
  return "handleCommand" in handler;
};

const isMessageHandler = (handler: IHandler): handler is IMessageHandler => {
  return "handleMessage" in handler;
};

const asMap = <T extends IHandler>(handlers: T[]): Map<string, T> => {
  return handlers.reduce((map, handler) => {
    map.set(handler.name, handler);
    return map;
  }, new Map<string, T>());
};

export const commandHandlers = asMap(allHandlers.filter(isCommandHandler));
export const messageHandlers = allHandlers.filter(isMessageHandler);

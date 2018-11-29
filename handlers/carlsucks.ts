import { IHandler } from "../types";
import isBot from "../utils/is_bot";

export default {
  command: "!carlsucks",
  description: "the core functionality that shall never be removed",

  applicable: (bot, logger, channelMessage) =>
    /!carlsucks/.test(channelMessage.message) && !isBot(channelMessage),

  process: (bot, logger, { channelID, evt }) => {
    logger.verbose(`[carlsucks] responding to message ${evt.d.id}`);
    bot.sendMessage({ message: "HEJ på dig din jävel!", to: channelID });
  }
} as IHandler;

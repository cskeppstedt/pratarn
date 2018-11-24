import { IHandler } from "../types";

export default {
  name: "carlsucks",

  applicable: (bot, logger, channelMessage) =>
    /!carlsucks/.test(channelMessage.message),

  process: (bot, logger, { channelID, evt }) => {
    logger.verbose(`[carlsucks] responding to message ${evt.d.id}`);
    bot.sendMessage({ message: "HEJ på dig din jävel!", to: channelID });
  }
} as IHandler;

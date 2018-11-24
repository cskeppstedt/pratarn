import { IHandler } from "./handler";

export default {
  name: "carlsucks",

  applicable: (bot, logger, channelMessage) =>
    /!carlsucks/.test(channelMessage.message),

  process: (bot, logger, { channelID, message }) => {
    bot.sendMessage({ message: "HEJ på dig din jävel!", to: channelID });
  }
} as IHandler;

import { IHandler } from "./handler";

export default {
  name: "carlsucks",
  applicable: (message: string) => /!carlsucks/.test(message),
  process: (bot, logger, { channelID, message }) => {
    bot.sendMessage({
      message: "HEJ på dig din jävel!",
      to: channelID
    });
  }
} as IHandler;

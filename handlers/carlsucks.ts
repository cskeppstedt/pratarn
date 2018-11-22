import { IHandler } from "./handler";

const carlsucks: IHandler = {
  name: "carlsucks",
  applicable: (message: string) => /!carlsucks/.test(message),
  process: (bot, logger, { channelID, message }) => {
    bot.sendMessage({
      message: "HEJ på dig din jävel!",
      to: channelID
    });
  }
};

export default carlsucks;

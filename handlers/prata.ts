import { IHandler } from "./handler";

const prata: IHandler = {
  name: "prata",
  applicable: (message: string) => /!prata .+/.test(message),
  process: (bot, logger, { channelID, message }) => {
    const targetUserName = message.substring("!prata ".length);
    bot.sendMessage({
      message: `let me uhm get back to you on that`,
      to: channelID
    });

    bot.getMessages({ channelID }, (error, response) => {
      if (error) {
        logger.error(JSON.stringify(error));
      } else {
        logger.verbose(`[prata] getMessages - ${JSON.stringify(response)}`);
      }
    });
  }
};

export default prata;

import Discord from "discord.io";
import { IHandler, IHandlerProcess, IHandlerApplicable } from "./handler";

const shouldRespond: IHandlerApplicable = channelMessage =>
  /!prata .+/.test(channelMessage.message);

const shouldRecordMessage: IHandlerApplicable = channelMessage => false;

const respond: IHandlerProcess = (bot, logger, { channelID, message, evt }) => {
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
};

const recordMessage: IHandlerProcess = (bot, logger, channelMessage) => {};

export default {
  name: "prata",
  applicable: channelMessage =>
    shouldRespond(channelMessage) || shouldRecordMessage(channelMessage),
  process: (bot, logger, channelMessage) => {
    if (shouldRespond(channelMessage)) {
      respond(bot, logger, channelMessage);
    } else if (shouldRecordMessage(channelMessage)) {
      recordMessage(bot, logger, channelMessage);
    }
  }
} as IHandler;

import { IHandler } from "../types";
import { randomGalleryImage } from "../utils/imgur";
import isBot from "../utils/is_bot";

const describeCommands = (handlers: IHandler[]) =>
  "\n\n" +
  handlers
    .map(({ command, description }) => `**${command}**\n${description}`)
    .join("\n\n");

export default (handlers: IHandler[]) =>
  ({
    command: "!help",
    description: "displays a list of commands and their description",

    applicable: (bot, logger, channelMessage) =>
      (/!help/.test(channelMessage.message) ||
        /!pratarn/.test(channelMessage.message)) &&
      !isBot(channelMessage),

    process: async (bot, logger, { channelID, message, evt }) => {
      logger.verbose(`[help] responding to message ${evt.d.id} `);
      bot.sendMessage({
        message: describeCommands(handlers),
        to: channelID
      });
    }
  } as IHandler);

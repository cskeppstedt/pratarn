import { IHandler } from '../types';
import isBot from '../utils/is_bot';

const describeCommands = (handlers: IHandler[]) => `Available commands:\n\n${handlers
  .map(({ command, description }) => `**${command}**\n${description}`)
  .join('\n\n')}`;

export default (handlers: IHandler[]) => ({
  command: '!help',
  description: 'displays a list of commands and their description',

  applicable: (bot, logger, channelMessage) => (/^!help/i.test(channelMessage.message)
        || /^!pratarn/i.test(channelMessage.message))
      && !isBot(channelMessage),

  process: async (bot, logger, { channelID, evt }) => {
    logger.info(`[help] responding to message ${evt.d.id} `);
    bot.sendMessage({
      message: describeCommands(handlers),
      to: channelID,
    });
  },
} as IHandler);

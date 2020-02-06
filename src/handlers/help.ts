import { IHandler } from '../types';
import isBot from '../utils/is_bot';

const describeCommands = (handlers: IHandler[]) => {
  const handlerDescriptions = handlers
    .map(({ command, description }) => `**${command}**\n${description}`);
  return ['Pratarn (discord.js)', 'Available commands:', ...handlerDescriptions].join('\n\n');
};

export default (handlers: IHandler[]) => ({
  command: '!help',
  description: 'displays a list of commands and their description',

  applicable: (bot, logger, message) => (/^!help/i.test(message.content)
        || /^!pratarn/i.test(message.content))
      && !isBot(message),

  process: async (bot, logger, message) => {
    logger.info(`[help] responding to message ${message.id} `);
    message.reply(describeCommands(handlers));
  },
} as IHandler);

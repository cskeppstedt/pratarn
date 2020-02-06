import { IHandler } from '../types';
import isBot from '../utils/is_bot';

export default {
  command: '!carlsucks',
  description: 'the core functionality that shall never be removed',

  applicable: (bot, logger, message) => /^!carlsucks/i.test(message.content) && !isBot(message),

  process: (bot, logger, message) => {
    logger.info(`[carlsucks] responding to message ${message.id}`);
    message.reply('HEJ på dig din jävel!');
  },
} as IHandler;

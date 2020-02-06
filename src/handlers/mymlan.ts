import { IHandler } from '../types';
import isBot from '../utils/is_bot';
import repeat from '../utils/repeat';

const asciiChatBubble = (chatBubbleMessage: string) => [
  ` ${repeat('_', chatBubbleMessage.length + 2)}`,
  `( ${chatBubbleMessage} )`,
  ` ${repeat('-', chatBubbleMessage.length + 2)}`,
  '    o',
  '     o',
].join('\n');

const asciiDogMessage = (chatBubbleMessage: string) => [
  '```',
  chatBubbleMessage && chatBubbleMessage.length > 0
    ? asciiChatBubble(chatBubbleMessage)
    : '',
  "        ''',",
  '     o_)O )____)"',
  '      \\_        )',
  "Veoff!  '',,,,,,",
  '          ||  ||',
  '         "--\'"--\'"',
  '',
  '```',
].join('\n');

export default {
  command: '!mymlan',
  description: 'shows the inner thoughts of the mymmel',

  applicable: (bot, logger, message) => /^!mymlan/i.test(message.content) && !isBot(message),

  process: (bot, logger, message) => {
    const chatBubbleMessage = message.content.substring('!mymlan '.length);
    logger.info(`[mymlan] responding to message ${message.id} `);
    message.reply(asciiDogMessage(chatBubbleMessage));
  },
} as IHandler;

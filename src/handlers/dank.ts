import { IHandler } from '../types';
import { randomGalleryImage } from '../utils/imgur';
import isBot from '../utils/is_bot';

export default {
  command: '!dank',
  description: 'links a random r/dankmemes image from this month',

  applicable: (bot, logger, channelMessage) => /^!dank/i.test(channelMessage.content) && !isBot(channelMessage),

  process: async (bot, logger, message) => {
    logger.info(`[dank] responding to message ${message.id} `);
    const image = await randomGalleryImage({
      subreddit: 'dankmemes',
      sort: 'top',
      window: 'week',
    });
    message.reply(image.link);
  },
} as IHandler;

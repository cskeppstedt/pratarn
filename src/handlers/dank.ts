import { IHandler } from '../types';
import { randomGalleryImage } from '../utils/imgur';
import isBot from '../utils/is_bot';

export default {
  command: '!dank',
  description: 'links a random r/dankmemes image from this month',

  applicable: (bot, logger, channelMessage) => /^!dank/i.test(channelMessage.message) && !isBot(channelMessage),

  process: async (bot, logger, { channelID, evt }) => {
    logger.info(`[dank] responding to message ${evt.d.id} `);
    const image = await randomGalleryImage({ subreddit: 'dankmemes' });
    bot.sendMessage({ message: image.link, to: channelID });
  },
} as IHandler;

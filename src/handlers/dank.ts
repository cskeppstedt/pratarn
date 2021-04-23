import { IHandler } from '../types';
import { ISubredditGalleryOptions } from '../utils/imgur';
import isBot from '../utils/is_bot';
import replyImgurMessage, { commandDescription } from '../utils/reply_imgur_message';

export const galleryOptions: ISubredditGalleryOptions = {
  subreddit: 'dankmemes',
  sort: 'top',
  window: 'week',
};

export default {
  command: '!dank',
  description: commandDescription(galleryOptions),

  applicable: (bot, logger, channelMessage) => /^!dank/i.test(channelMessage.content) && !isBot(channelMessage),

  process: (bot, logger, message) => {
    logger.info(`[dank] responding to message ${message.id} `);
    return replyImgurMessage(galleryOptions, message);
  },
} as IHandler;

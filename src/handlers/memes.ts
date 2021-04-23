import { IHandler } from '../types';
import { ISubredditGalleryOptions } from '../utils/imgur';
import isBot from '../utils/is_bot';
import replyImgurMessage, { commandDescription } from '../utils/reply_imgur_message';

export const galleryOptions: ISubredditGalleryOptions = {
  subreddit: 'memes',
  sort: 'top',
  window: 'month',
};

export default {
  command: '!memes',
  description: commandDescription(galleryOptions),

  applicable: (bot, logger, channelMessage) => /^!memes/i.test(channelMessage.content) && !isBot(channelMessage),

  process: (bot, logger, message) => {
    logger.info(`[memes] responding to message ${message.id} `);
    return replyImgurMessage(galleryOptions, message);
  },
} as IHandler;

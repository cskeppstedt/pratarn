import { IHandler } from '../types';
import { ISubredditGalleryOptions } from '../utils/imgur';
import isBot from '../utils/is_bot';
import replyImgurMessage, { commandDescription } from '../utils/reply_imgur_message';

const galleryOptions: ISubredditGalleryOptions = {
  subreddit: 'Animemes',
  sort: 'top',
  window: 'month',
};

export default {
  command: '!weeb',
  description: commandDescription(galleryOptions),

  applicable: (bot, logger, channelMessage) => (/^!weeb/i.test(channelMessage.content)
      || /^!animemes/i.test(channelMessage.content)
      || /^!senpai/i.test(channelMessage.content)
      || /^!sensei/i.test(channelMessage.content))
    && !isBot(channelMessage),

  process: (bot, logger, message) => {
    logger.info(`[memes] responding to message ${message.id} `);
    return replyImgurMessage(galleryOptions, message);
  },
} as IHandler;

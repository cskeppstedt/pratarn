import { Message } from 'discord.js';
import { IHandler } from '../types';
import { randomGalleryImage } from '../utils/imgur';
import isBot from '../utils/is_bot';
import replyImgurMessage, { commandDescription, formatImgurMessage } from '../utils/reply_imgur_message';
import {galleryOptions as dankGalleryOptions} from "./dank"
import {galleryOptions as memesGalleryOptions} from "./memes"
import {galleryOptions as weebGalleryOptions} from "./weeb"

const parseGallery = (msg: Message): string => {
  const reSubreddit = /from r\/(\w+)/;
  const matches = (msg.content||"").match(reSubreddit);
  return (matches?.length === 2) ? matches[1] : "";
}

const getGalleryOptions = (msg: Message | null | void) => {
  if (!msg) {
    return null;
  }

  const gallery = parseGallery(msg);
  switch(gallery) {
    case dankGalleryOptions.subreddit:
      return (dankGalleryOptions);
    case memesGalleryOptions.subreddit:
      return (memesGalleryOptions);
    case weebGalleryOptions.subreddit:
      return (weebGalleryOptions);
    default:
      return null;
  }
}

export default {
  command: '!ree',
  description: 'The last !dank meme was shit? Replace it with !reeeeeeeee',

  applicable: (bot, logger, channelMessage) => /^!ree/i.test(channelMessage.content) && !isBot(channelMessage),

  process: async (bot, logger, message) => {
    logger.info(`[ree] responding to message ${message.id} `);

    const lastMessages = await message.channel.messages.fetch({ limit: 20 });
    const lastGalleryMessage = lastMessages.find(msg => msg.author.id === bot.user?.id && parseGallery(msg) != "")
    const galleryOptions = getGalleryOptions(lastGalleryMessage);
    if (lastGalleryMessage && galleryOptions) {
      const image = await randomGalleryImage(galleryOptions);
      logger.info(`[ree] replacing message ${lastGalleryMessage.id} with new gallery image from r/${galleryOptions.subreddit}`);
      lastGalleryMessage.edit(formatImgurMessage(galleryOptions, image));
    } else {
      message.reply("sry hittade ingen meme-post att uppdatera :(")
    }
  },
} as IHandler;

import { IHandler } from "../types";
import { randomGalleryImage } from "../utils/imgur";
import isBot from "../utils/is_bot";

export default {
  name: "dank",

  applicable: (bot, logger, channelMessage) =>
    /!dank/.test(channelMessage.message) && !isBot(channelMessage),

  process: async (bot, logger, { channelID, message, evt }) => {
    logger.verbose(`[dank] responding to message ${evt.d.id} `);
    const image = await randomGalleryImage({ subreddit: "dankmemes" });
    bot.sendMessage({ message: image.link, to: channelID });
  }
} as IHandler;
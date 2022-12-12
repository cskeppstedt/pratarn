import { Collection, Message, SlashCommandBuilder } from "discord.js";
import { ICommandHandler } from "../types";
import { randomGalleryImage } from "../utils/imgur";
import { formatImgurMessage } from "../utils/reply_imgur_message";
import { galleryOptions as dankGalleryOptions } from "./dank";
import { galleryOptions as memesGalleryOptions } from "./memes";
import { galleryOptions as weebGalleryOptions } from "./weeb";

const parseGallery = (msg: Message): string => {
  const reSubreddit = /from r\/(\w+)/;
  const matches = (msg.content || "").match(reSubreddit);
  return matches?.length === 2 ? matches[1] : "";
};

const getGalleryOptions = (msg: Message | null | void) => {
  if (!msg) {
    return null;
  }

  const gallery = parseGallery(msg);
  switch (gallery) {
    case dankGalleryOptions.subreddit:
      return dankGalleryOptions;
    case memesGalleryOptions.subreddit:
      return memesGalleryOptions;
    case weebGalleryOptions.subreddit:
      return weebGalleryOptions;
    default:
      return null;
  }
};

const NAME = "ree";

const ree: ICommandHandler = {
  name: NAME,

  command: new SlashCommandBuilder()
    .setName(NAME)
    .setDescription(
      "The last !dank meme was shit? Replace it with !reeeeeeeee"
    ),

  handleCommand: async (bot, logger, interaction) => {
    logger.info(`[ree] responding to message ${interaction.id} `);
    if (!interaction.channel) {
      interaction.reply("sry funkar bara i en kanal");
      return;
    }

    const lastMessages = await interaction.channel.messages.fetch({
      limit: 20,
    });

    const lastGalleryMessage = (
      lastMessages as Collection<string, Message<any>>
    ).find((msg) => msg.author.id === bot.user?.id && parseGallery(msg) != "");
    const galleryOptions = getGalleryOptions(lastGalleryMessage);
    if (lastGalleryMessage && galleryOptions) {
      const image = await randomGalleryImage(galleryOptions);
      logger.info(
        `[ree] replacing message ${lastGalleryMessage.id} with new gallery image from r/${galleryOptions.subreddit}`
      );
      lastGalleryMessage.edit(formatImgurMessage(galleryOptions, image));
    } else {
      interaction.reply("sry hittade ingen meme-post att uppdatera :(");
    }
  },
};

export default ree;

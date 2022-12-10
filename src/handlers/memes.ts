import { SlashCommandBuilder } from "discord.js";
import { IHandler } from "../types";
import { ISubredditGalleryOptions } from "../utils/imgur";
import replyImgurMessage, {
  commandDescription,
} from "../utils/reply_imgur_message";

export const galleryOptions: ISubredditGalleryOptions = {
  subreddit: "memes",
  sort: "top",
  window: "month",
};

const NAME = "memes";

const memes: IHandler = {
  name: NAME,

  command: new SlashCommandBuilder()
    .setName(NAME)
    .setDescription(commandDescription(galleryOptions)),

  execute: (bot, logger, interaction) => {
    logger.info(`[memes] responding to message ${interaction.id} `);
    return replyImgurMessage(galleryOptions, interaction);
  },
};

export default memes;

import { SlashCommandBuilder } from "discord.js";
import { IHandler } from "../types";
import { ISubredditGalleryOptions } from "../utils/imgur";
import replyImgurMessage, {
  commandDescription,
} from "../utils/reply_imgur_message";

export const galleryOptions: ISubredditGalleryOptions = {
  subreddit: "dankmemes",
  sort: "top",
  window: "week",
};

const NAME = "dank";

const dank: IHandler = {
  name: NAME,

  command: new SlashCommandBuilder()
    .setName("dank")
    .setDescription(commandDescription(galleryOptions)),

  execute: (bot, logger, interaction) => {
    logger.info(`[dank] responding to message ${interaction.id} `);
    return replyImgurMessage(galleryOptions, interaction);
  },
};

export default dank;

import { SlashCommandBuilder } from "discord.js";
import { ICommandHandler } from "../types";
import { ISubredditGalleryOptionsInput } from "../utils/imgur";
import {
  replyCommandInteraction,
  commandDescription,
} from "../utils/reply_imgur_message";

export const galleryOptions: ISubredditGalleryOptionsInput = {
  subreddit: "dankmemes",
  sort: "top",
  window: "month",
};

const NAME = "dank";

const dank: ICommandHandler = {
  name: NAME,

  command: new SlashCommandBuilder()
    .setName("dank")
    .setDescription(commandDescription(galleryOptions)),

  handleCommand: (bot, logger, interaction) => {
    logger.info(`[dank] responding to message ${interaction.id} `);
    return replyCommandInteraction(galleryOptions, interaction);
  },
};

export default dank;

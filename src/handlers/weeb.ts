import { SlashCommandBuilder } from "discord.js";
import { ICommandHandler } from "../types";
import {
  ISubredditGalleryOptions,
  ISubredditGalleryOptionsInput,
} from "../utils/imgur";
import {
  replyCommandInteraction,
  commandDescription,
} from "../utils/reply_imgur_message";

export const galleryOptions: ISubredditGalleryOptionsInput = {
  subreddit: "Animemes",
  sort: "top",
  window: "month",
};

const NAME = "weeb";

const weeb: ICommandHandler = {
  name: NAME,

  command: new SlashCommandBuilder()
    .setName(NAME)
    .setDescription(commandDescription(galleryOptions)),

  handleCommand: (bot, logger, interaction) => {
    logger.info(`[weeb] responding to message ${interaction.id} `);
    return replyCommandInteraction(galleryOptions, interaction);
  },
};

export default weeb;

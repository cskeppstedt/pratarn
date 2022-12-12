import { SlashCommandBuilder } from "discord.js";
import { ICommandHandler } from "../types";
import { ISubredditGalleryOptionsInput } from "../utils/imgur";
import {
  replyCommandInteraction,
  commandDescription,
} from "../utils/reply_imgur_message";

export const galleryOptions: ISubredditGalleryOptionsInput = {
  subreddit: "memes",
  sort: "top",
  window: "month",
};

const NAME = "memes";

const memes: ICommandHandler = {
  name: NAME,

  command: new SlashCommandBuilder()
    .setName(NAME)
    .setDescription(commandDescription(galleryOptions)),

  handleCommand: (bot, logger, interaction) => {
    logger.info(`[memes] responding to message ${interaction.id} `);
    return replyCommandInteraction(galleryOptions, interaction);
  },
};

export default memes;

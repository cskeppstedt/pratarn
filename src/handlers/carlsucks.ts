import { SlashCommandBuilder } from "discord.js";
import { IHandler } from "../types";

const NAME = "carlsucks";

const carlsucks: IHandler = {
  name: NAME,

  command: new SlashCommandBuilder()
    .setName(NAME)
    .setDescription("the core functionality that shall never be removed"),

  execute: (bot, logger, interaction) => {
    logger.info(`[carlsucks] responding to message ${interaction.id}`);
    if (interaction.isRepliable())
      return interaction.reply({
        content: "HEJ på dig din jävel!",
      });
  },
};

export default carlsucks;

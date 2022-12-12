import { SlashCommandBuilder } from "discord.js";
import { ICommandHandler } from "../types";

const NAME = "carlsucks";

const carlsucks: ICommandHandler = {
  name: NAME,

  command: new SlashCommandBuilder()
    .setName(NAME)
    .setDescription("the core functionality that shall never be removed"),

  handleCommand: async (bot, logger, interaction) => {
    logger.info(`[carlsucks] responding to message ${interaction.id}`);
    if (interaction.isRepliable())
      return interaction.reply({
        content: "HEJ på dig din jävel!",
      });
  },
};

export default carlsucks;

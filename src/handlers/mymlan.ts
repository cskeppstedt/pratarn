import { SlashCommandBuilder } from "discord.js";
import { IHandler } from "../types";
import repeat from "../utils/repeat";

const asciiChatBubble = (chatBubbleMessage: string) =>
  [
    ` ${repeat("_", chatBubbleMessage.length + 2)}`,
    `( ${chatBubbleMessage} )`,
    ` ${repeat("-", chatBubbleMessage.length + 2)}`,
    "    o",
    "     o",
  ].join("\n");

const asciiDogMessage = (chatBubbleMessage: string) =>
  [
    "```",
    chatBubbleMessage && chatBubbleMessage.length > 0
      ? asciiChatBubble(chatBubbleMessage)
      : "",
    "        ''',",
    '     o_)O )____)"',
    "      \\_        )",
    "Veoff!  '',,,,,,",
    "          ||  ||",
    '         "--\'"--\'"',
    "",
    "```",
  ].join("\n");

const MESSAGE_OPTION = "message";
const NAME = "mymlan";

const mymlan: IHandler = {
  name: NAME,

  command: new SlashCommandBuilder()
    .setName(NAME)
    .setDescription("shows the inner thoughts of the mymmel")
    .addStringOption((opt) =>
      opt
        .setName(MESSAGE_OPTION)
        .setDescription("the message that mymlan should mymla")
    ),

  execute: (bot, logger, interaction) => {
    const message = interaction.options.get(MESSAGE_OPTION)?.value;
    if (typeof message === "string" && message) {
      logger.info(`[mymlan] responding to message ${interaction.id} `);
      interaction.reply(asciiDogMessage(message));
    }
  },
};

export default mymlan;

import { IHandler } from "../types";
import repeat from "../utils/repeat";

const asciiChatBubble = (chatBubbleMessage: string) =>
  [
    " " + repeat("_", chatBubbleMessage.length + 2),
    `( ${chatBubbleMessage} )`,
    " " + repeat("-", chatBubbleMessage.length + 2),
    "    o",
    "     o"
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
    "```"
  ].join("\n");

export default {
  name: "mymlan",

  applicable: (bot, logger, channelMessage) =>
    /!mymlan/.test(channelMessage.message),

  process: (bot, logger, { channelID, message, evt }) => {
    const chatBubbleMessage = message.substring("!mymlan ".length);
    logger.verbose(`[mymlan] responding to message ${evt.d.id} `);
    bot.sendMessage({
      message: asciiDogMessage(chatBubbleMessage),
      to: channelID
    });
  }
} as IHandler;

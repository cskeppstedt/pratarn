import repeat from "../utils/repeat";
import { IHandler } from "./handler";

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
  applicable: channelMessage => /!mymlan/.test(channelMessage.message),
  process: (bot, logger, { channelID, message }) => {
    const chatBubbleMessage = message.substring("!mymlan ".length);
    bot.sendMessage({
      message: asciiDogMessage(chatBubbleMessage),
      to: channelID
    });
  }
} as IHandler;

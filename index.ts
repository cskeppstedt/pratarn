import Discord from "discord.io";
import crawl_messages from "./crawl_messages";
import handlers from "./handlers";
import logger from "./utils/logger";
import { parseMessageEvents } from "./utils/parse_log";

require("dotenv").config();

const discordAuthToken: string = process.env.DISCORD_AUTH_TOKEN || "";

if (!discordAuthToken) {
  console.error("DISCORD_AUTH_TOKEN not defined");
  process.exit(1);
}

const bot = new Discord.Client({
  token: discordAuthToken
});

bot.on("ready", () => {
  logger.info(
    `[bot] connected - logged in as: ${bot.username} - id: ${bot.id}`
  );
  // const ORDSKRIVING_CHANNEL_ID = "182952289122779136";
  // const BEFORE = undefined;
  // crawl_messages(bot, ORDSKRIVING_CHANNEL_ID, BEFORE);
});

bot.on(
  "message",
  (
    user: string,
    userID: string,
    channelID: string,
    message: string,
    evt: any
  ) => {
    logger.verbose(
      `[bot] message event - user: ${user} - userID: ${userID} - channelID: ${channelID}` +
        ` - message: ${message} - evt: ${JSON.stringify(evt)}`
    );

    const channelMessage = { user, userID, channelID, message, evt };

    const applicableHandlers = handlers.filter((handler) =>
      handler.applicable(bot, logger, channelMessage)
    );

    if (applicableHandlers.length > 0) {
      applicableHandlers.forEach((handler) => {
        logger.verbose(`[bot] running handler: ${handler.name}`);
        handler.process(bot, logger, channelMessage);
      });
    }
  }
);

bot.on("disconnect", (errMsg, code) => {
  logger.info(`[bot] disconnected - error: ${errMsg} - code ${code}`);
});

logger.info(`[bot] handlers: ${handlers.map((h) => h.name).join(", ")}`);
logger.info("[bot] attempting to connect");
bot.connect();

// handle program shutdown
process.stdin.resume();

function exitHandler(code: any) {
  logger.info(`[bot] shutdown requested, disconnecting - code: ${code}`);
  try {
    bot.disconnect();
  } catch {}
  process.exit();
}

process.on("exit", exitHandler.bind(null));
process.on("SIGINT", exitHandler.bind(null));
process.on("SIGUSR1", exitHandler.bind(null));
process.on("SIGUSR2", exitHandler.bind(null));
process.on("uncaughtException", exitHandler.bind(null));

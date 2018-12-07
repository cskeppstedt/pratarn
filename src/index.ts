import Discord from "discord.io";
import http from "http";
import handlers from "./handlers";
import logger from "./utils/logger";
import { parseMessageEvents } from "./utils/parse_log";

require("dotenv").config();

const discordAuthToken: string = process.env.DISCORD_AUTH_TOKEN || "";

if (!discordAuthToken) {
  console.error("DISCORD_AUTH_TOKEN not defined");
  process.exit(1);
}

const bot = new Discord.Client({ token: discordAuthToken });

bot.on("ready", () => {
  logger.info(
    `[bot] connected - logged in as: ${bot.username} - id: ${bot.id}`
  );
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
        logger.verbose(`[bot] running handler: ${handler.command}`);
        handler.process(bot, logger, channelMessage);
      });
    }
  }
);

bot.on("disconnect", (errMsg, code) => {
  logger.info(`[bot] disconnected - error: ${errMsg} - code ${code}`);
});

logger.info(`[bot] handlers: ${handlers.map((h) => h.command).join(", ")}`);
logger.info("[bot] attempting to connect");

const server = http.createServer((req, res) => {
  if (bot.connected) {
    const body = "Bot connected\n";
    const contentLength = body.length;
    res.writeHead(200, {
      "Content-Length": contentLength,
      "Content-Type": "text/plain"
    });
    res.end(body);
  } else {
    const body = "Bot not connected\n";
    const contentLength = body.length;
    res.writeHead(500, {
      "Content-Length": contentLength,
      "Content-Type": "text/plain"
    });
    res.end(body);
  }
});

server.listen(8080);
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

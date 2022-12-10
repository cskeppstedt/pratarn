import { Client, Events, GatewayIntentBits } from "discord.js";
import handlers from "./handlers";
import logger from "./utils/logger";
import { assertReadEnv } from "./utils/readEnv";

require("dotenv").config();

let isShuttingDown = false;
const discordAuthToken = assertReadEnv("DISCORD_AUTH_TOKEN");

if (!discordAuthToken) {
  console.error("DISCORD_AUTH_TOKEN not defined");
  process.exit(1);
}

const bot = new Client({
  intents: [GatewayIntentBits.MessageContent, GatewayIntentBits.DirectMessages],
});

bot.once(Events.ClientReady, () => {
  logger.info(
    `[bot] connected - logged in as: ${bot.user?.username} - id: ${bot.user?.id}`
  );
});

bot.on(Events.InteractionCreate, (interaction) => {
  if (interaction.isCommand()) {
    const handler = handlers.get(interaction.commandName);
    if (handler) {
      logger.verbose(`[bot] running handler: ${handler.name}`);
      handler.execute(bot, logger, interaction);
    }
  }
});

// bot.on(Events.MessageCreate, (message) => {
//   logger.verbose(
//     [
//       "[bot] message event",
//       `user: ${message.author.username}`,
//       `userID: ${message.author.id}`,
//       `channelID: ${message.channel.id}`,
//       `message: ${message.content}`,
//     ].join(" - ")
//   );

//   const applicableHandlers = handlers.filter((handler) =>
//     handler.applicable(bot, logger, message)
//   );

//   if (applicableHandlers.length > 0) {
//     applicableHandlers.forEach((handler) => {
//       logger.verbose(`[bot] running handler: ${handler.command}`);
//       handler.execute(bot, logger, message);
//     });
//   }
// });

bot.on(Events.ShardDisconnect, (evt: any) => {
  logger.warn(`[bot] disconnected - evt`, { evt });

  if (!isShuttingDown) {
    setTimeout(() => {
      logger.info("[bot] attempting to reconnect");
      bot.login(discordAuthToken);
    }, 3000);
  }
});

logger.info(`[bot] working dir: ${process.cwd()}`);
logger.info(`[bot] handlers: ${[...handlers.keys()].join(", ")}`);
logger.info("[bot] attempting to connect");

function exitHandler(code: any) {
  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;
  logger.info(`[bot] shutdown requested, disconnecting - code: ${code}`);
  try {
    bot.destroy();
  } catch (err) {
    console.error(err);
  }
  process.exit();
}

process.on("exit", exitHandler.bind(null));
process.on("SIGINT", exitHandler.bind(null));
process.on("SIGUSR1", exitHandler.bind(null));
process.on("SIGUSR2", exitHandler.bind(null));
process.on("uncaughtException", exitHandler.bind(null));

bot.login(discordAuthToken);

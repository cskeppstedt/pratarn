import { Client, Events, GatewayIntentBits, Partials } from "discord.js";
import { commandHandlers, messageHandlers } from "./handlers";
import { IHandler } from "./types";
import logger from "./utils/logger";
import { assertReadEnv } from "./utils/readEnv";
import { REE_BUTTON_ID, updateMessageRee } from "./utils/reply_imgur_message";

require("dotenv").config();

let isShuttingDown = false;
const discordAuthToken = assertReadEnv("DISCORD_AUTH_TOKEN");

if (!discordAuthToken) {
  console.error("DISCORD_AUTH_TOKEN not defined");
  process.exit(1);
}

const bot = new Client({
  intents: [
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Channel],
});

bot.once(Events.ClientReady, () => {
  logger.info(
    `[bot] connected - logged in as: ${bot.user?.username} - id: ${bot.user?.id}`
  );
});

bot.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isCommand()) {
    return;
  }
  const handler = commandHandlers.get(interaction.commandName);
  if (handler) {
    logger.verbose(`[bot] running command handler: ${handler.name}`);
    await handler.handleCommand(bot, logger, interaction);
  }
});

bot.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isButton()) {
    return;
  }
  if (interaction.customId === REE_BUTTON_ID) {
    logger.info(`[bot] running button handler: ${REE_BUTTON_ID}`);
    await updateMessageRee(interaction);
  }
});

bot.on(Events.MessageCreate, async (message) => {
  await Promise.allSettled(
    messageHandlers.map(async (handler) => {
      logger.verbose(`[bot] running message handler: ${handler.name}`);
      try {
        return await handler.handleMessage(bot, logger, message);
      } catch (err) {
        logger.error(`[bot] message handler [${handler.name}]: ${err}`);
        console.error(err);
      }
    })
  );
});

bot.on(Events.ShardDisconnect, (evt: any) => {
  logger.warn(`[bot] disconnected - evt`, { evt });

  if (!isShuttingDown) {
    setTimeout(() => {
      logger.info("[bot] attempting to reconnect");
      bot.login(discordAuthToken);
    }, 3000);
  }
});

bot.on(Events.Error, (err) => {
  logger.info(`[bot] error: ${err}`);
  console.error(err);
});

const formatHandlers = (handlers: IHandler[]) =>
  [...handlers.map((handler) => handler.name)].join(", ");

logger.info(`[bot] working dir: ${process.cwd()}`);
logger.info(
  `[bot] command handlers: ${formatHandlers([...commandHandlers.values()])}`
);
logger.info(`[bot] message handlers: ${formatHandlers(messageHandlers)}`);
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

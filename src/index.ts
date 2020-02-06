import Discord from 'discord.js';
import handlers from './handlers';
import logger from './utils/logger';

require('dotenv').config();

const discordAuthToken: string = process.env.DISCORD_AUTH_TOKEN || '';

if (!discordAuthToken) {
  console.error('DISCORD_AUTH_TOKEN not defined');
  process.exit(1);
}

const bot = new Discord.Client();

bot.on('ready', () => {
  logger.info(`[bot] connected - logged in as: ${bot.user.username} - id: ${bot.user.id}`);
});

bot.on(
  'message',
  (message) => {
    logger.verbose([
      '[bot] message event',
      `user: ${message.author.username}`,
      `userID: ${message.author.id}`,
      `channelID: ${message.channel.id}`,
      `message: ${message.content}`,
    ].join(' - '));

    const applicableHandlers = handlers.filter((handler) => handler.applicable(bot, logger, message));

    if (applicableHandlers.length > 0) {
      applicableHandlers.forEach((handler) => {
        logger.verbose(`[bot] running handler: ${handler.command}`);
        handler.process(bot, logger, message);
      });
    }
  },
);

bot.on('disconnect', (evt: any) => {
  logger.info(`[bot] disconnected - evt: ${evt}`);

  setTimeout(() => {
    logger.info('[bot] attempting reconnect');
    bot.login(discordAuthToken);
  }, 3000);
});

logger.info(`[bot] handlers: ${handlers.map((h) => h.command).join(', ')}`);
logger.info('[bot] attempting to connect');

bot.login(discordAuthToken);

// handle program shutdown
process.stdin.resume();

function exitHandler(code: any) {
  logger.info(`[bot] shutdown requested, disconnecting - code: ${code}`);
  try {
    bot.destroy();
  } catch (err) {
    console.error(err);
  }
  process.exit();
}

process.on('exit', exitHandler.bind(null));
process.on('SIGINT', exitHandler.bind(null));
process.on('SIGUSR1', exitHandler.bind(null));
process.on('SIGUSR2', exitHandler.bind(null));
process.on('uncaughtException', exitHandler.bind(null));

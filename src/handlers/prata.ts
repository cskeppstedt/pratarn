import Discord from 'discord.js';
import { buildMap, generateSentence, tokenizeParagraphs } from 'oh-hi-markov';
import {
  IHandler,
  IHandlerProcess,
  IPratarnLogger,
  IStorageMessageView,
} from '../types';
import {
  fetchMessageObjectsCached,
  insertMessageObject,
} from '../utils/dynamo';
import isBot from '../utils/is_bot';
import normalizeUsername from '../utils/normalize_username';
import randomInt from '../utils/random_int';
import shouldRecordMessage from '../utils/should_record_message';
import toStorageMessageView, {
  getAuthorUsername,
} from '../utils/to_storage_message_view';

const getUsernameFromMessage = (message: string) => message
  .replace(/(--\w+)/g, '')
  .substr('!prata'.length)
  .trim();

const getShowStats = (message: string) => message.includes('--stats');

const shouldRespond = (message: Discord.Message) => /^!prata/i.test(message.content);

const makeParagraphs = (messages: IStorageMessageView[]) => messages.map((message) => message.content);

const makeResponse = async (
  logger: IPratarnLogger,
  username: string,
  showStats: boolean,
) => {
  const { messageObjects } = await fetchMessageObjectsCached(
    normalizeUsername(username),
  );

  if (messageObjects.length === 0) {
    return `sry känner inte igen **${username}** :(  testa annat username?`;
  }

  const paragraphs = makeParagraphs(messageObjects);
  const numWords = 8 + randomInt(5);
  const numSentences = 4;
  const prefixLength = 2;

  const tokenizedSentences = tokenizeParagraphs(paragraphs);
  const map = buildMap(tokenizedSentences, prefixLength);

  const stats = `[ ${[
    `markov params for ${username}`,
    `${messageObjects.length} messages`,
    `${Object.keys(map).length} map keys`,
    `target: ${numSentences} sentences, ${numWords} words, prefix length ${prefixLength}`,
  ].join(' - ')} ]`;

  logger.verbose(`[prata] ${stats}`);

  const generatedMessages = [`**${username}:**`];
  if (showStats) {
    generatedMessages.push(stats);
  }

  for (let i = 0; i < numSentences; i += 1) {
    generatedMessages.push(
      generateSentence({ tokenMap: map, maxLength: numWords, prefixLength }),
    );
  }

  return generatedMessages.join('\n\n');
};

const respond: IHandlerProcess = async (bot, logger, message) => {
  try {
    const targetUserName = getUsernameFromMessage(message.content) || getAuthorUsername(message);
    const showStats = getShowStats(message.content);
    const responseMessage = await makeResponse(
      logger,
      targetUserName,
      showStats,
    );
    logger.info(
      `[prata] responding to message ${message.id} for username ${targetUserName}`,
    );
    message.reply(responseMessage);
  } catch (err) {
    logger.error(`[prata] error occurred, possible throttling - ${err}`);
    console.error(err);
  }
};

const recordMessage: IHandlerProcess = (bot, logger, message) => {
  const messageView = toStorageMessageView(message);
  logger.info(
    `[prata] recording message - ${message.author.username} - ${messageView.id}`,
  );
  insertMessageObject(messageView);
};

export default {
  command: '!prata',
  description:
    'generate markov chain text for a username, e.g.: !prata skepparn',

  applicable: (bot, logger, channelMessage) => (shouldRespond(channelMessage) || shouldRecordMessage(channelMessage))
    && !isBot(channelMessage),

  process: (bot, logger, message) => {
    if (shouldRespond(message)) {
      respond(bot, logger, message);
    } else if (shouldRecordMessage(message)) {
      recordMessage(bot, logger, message);
    }
  },
} as IHandler;

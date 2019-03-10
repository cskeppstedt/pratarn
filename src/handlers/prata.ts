import { buildMap, generateSentence, tokenizeParagraphs } from "oh-hi-markov";
import {
  IChannelMessage,
  IHandler,
  IHandlerProcess,
  IPratarnLogger,
  IStorageMessageView
} from "../types";
import {
  fetchMessageObjectsCached,
  insertMessageObject
} from "../utils/dynamo";
import isBot from "../utils/is_bot";
import normalizeUsername from "../utils/normalize_username";
import randomInt from "../utils/random_int";
import shouldRecordMessage from "../utils/should_record_message";
import toStorageMessageView, {
  getAuthorUsername
} from "../utils/to_storage_message_view";

const getUsernameFromMessage = (message: string) =>
  message
    .replace(/(--\w+)/g, "")
    .substr("!prata".length)
    .trim();

const getShowStats = (message: string) => message.includes("--stats");

const shouldRespond = (channelMessage: IChannelMessage) =>
  /^!prata/i.test(channelMessage.message);

const makeParagraphs = (messages: IStorageMessageView[]) =>
  messages.map((message) => message.content);

const makeResponse = async (
  logger: IPratarnLogger,
  username: string,
  showStats: boolean
) => {
  const { messageObjects } = await fetchMessageObjectsCached(
    normalizeUsername(username)
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

  const stats = `[ markov params for ${username} - ${
    messageObjects.length
  } messages - ${numWords} words - ${numSentences} sentences - ${
    Object.keys(map).length
  } map keys`;

  logger.verbose(`[prata] ${stats}`);

  const generatedMessages = [`**${username}:**`];
  if (showStats) {
    generatedMessages.push(stats);
  }

  for (let i = 0; i < numSentences; i++) {
    generatedMessages.push(
      generateSentence({ tokenMap: map, maxLength: numWords, prefixLength })
    );
  }

  return generatedMessages.join("\n\n");
};

const respond: IHandlerProcess = async (
  bot,
  logger,
  { channelID, message, evt }
) => {
  try {
    const targetUserName =
      getUsernameFromMessage(message) || getAuthorUsername(evt.d);
    const showStats = getShowStats(message);
    const responseMessage = await makeResponse(
      logger,
      targetUserName,
      showStats
    );
    logger.info(
      `[prata] responding to message ${evt.d.id} for username ${targetUserName}`
    );
    bot.sendMessage({ message: responseMessage, to: channelID });
  } catch (err) {
    logger.error(`[prata] error occurred, possible throttling - ${err}`);
    console.error(err);
  }
};

const recordMessage: IHandlerProcess = (bot, logger, channelMessage) => {
  const messageView = toStorageMessageView(channelMessage.evt.d);
  logger.verbose(`[prata] recording message - ${messageView.id}`);
  insertMessageObject(messageView);
};

export default {
  command: "!prata",
  description:
    "generate markov chain text for a username, e.g.: !prata skepparn",

  applicable: (bot, logger, channelMessage) =>
    (shouldRespond(channelMessage) ||
      shouldRecordMessage(channelMessage.evt.d)) &&
    !isBot(channelMessage),

  process: (bot, logger, channelMessage) => {
    if (shouldRespond(channelMessage)) {
      respond(bot, logger, channelMessage);
    } else if (shouldRecordMessage(channelMessage.evt.d)) {
      recordMessage(bot, logger, channelMessage);
    }
  }
} as IHandler;

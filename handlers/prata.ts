import build from "../markov/build";
import generate from "../markov/generate";
import tokenize from "../markov/tokenize";
import {
  IChannelMessage,
  IHandler,
  IHandlerProcess,
  IPratarnLogger,
  IStorageMessageView
} from "../types";
import { fetchMessageObjects, insertMessageObject } from "../utils/dynamo";
import normalizeUsername from "../utils/normalize_username";
import randomInt from "../utils/random_int";
import shouldRecordMessage from "../utils/should_record_message";
import toStorageMessageView from "../utils/to_storage_message_view";

const shouldRespond = (channelMessage: IChannelMessage) =>
  /^!prata .+/.test(channelMessage.message);

const makeMessageCorpus = (messages: IStorageMessageView[]) =>
  messages.map((message) => message.content).join("\n");

const makeResponse = async (logger: IPratarnLogger, username: string) => {
  const { messageObjects } = await fetchMessageObjects(
    normalizeUsername(username)
  );

  if (messageObjects.length === 0) {
    return `sry känner inte igen **${username}** :(  testa annat username?`;
  }

  const corpus = makeMessageCorpus(messageObjects);
  const numWords = 8 + randomInt(5);
  const numSentences = 4;
  const prefixLength = 2;
  const tokens = tokenize(corpus);
  const map = build(tokens, prefixLength);

  logger.verbose(
    `[prata] markov params for ${username} - ${
      messageObjects.length
    } messages - ${numWords} words - ${numSentences} sentences - ${prefixLength} prefix length - ${
      tokens.length
    } tokens - ${map.keys().length} map keys - ${map.keys()}`
  );

  const generatedMessages = [`**${username}:**`];

  for (let i = 0; i < numSentences; i++) {
    generatedMessages.push(generate(randomInt, map, numWords, true));
  }

  return generatedMessages.join("\n\n");
};

const respond: IHandlerProcess = async (
  bot,
  logger,
  { channelID, message, evt }
) => {
  try {
    const targetUserName = message.substring("!prata ".length);
    const responseMessage = await makeResponse(logger, targetUserName);
    logger.verbose(
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
  name: "prata",

  applicable: (bot, logger, channelMessage) =>
    shouldRespond(channelMessage) || shouldRecordMessage(channelMessage.evt.d),

  process: (bot, logger, channelMessage) => {
    if (shouldRespond(channelMessage)) {
      respond(bot, logger, channelMessage);
    } else if (shouldRecordMessage(channelMessage.evt.d)) {
      recordMessage(bot, logger, channelMessage);
    }
  }
} as IHandler;

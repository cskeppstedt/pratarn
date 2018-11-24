import build from "../markov/build";
import generate from "../markov/generate";
import tokenize from "../markov/tokenize";
import { parseMessageEvents } from "../utils/parse_log";
import randomInt from "../utils/random_int";
import {
  IChannelMessage,
  IHandler,
  IHandlerProcess,
  IMessageObject,
  ISO8601Timestamp,
  snowflake
} from "./handler";

const shouldRespond = (channelMessage: IChannelMessage) =>
  /^!prata .+/.test(channelMessage.message);

const shouldRecordMessage = (channelMessage: IChannelMessage) => {
  if (/^!/.test(channelMessage.message)) {
    return false;
  }

  const messageObject = channelMessage.evt.d;

  if (messageObject.author.bot === true) {
    return false;
  }

  if (messageObject.webhook_id) {
    return false;
  }

  return true;
};

const fetchMessagesForUsername = async (username: string) => {
  const allMessages = await parseMessageEvents();
  return allMessages
    .map((evt) => evt.d)
    .filter((messageObject) => messageObject.author.username === username)
    .map(toStorageMessageView);
  // return Promise.resolve([
  //   {
  //     author_id: "123",
  //     author_username: "skepparn",
  //     content: "lol",
  //     id: "456",
  //     timestamp: "now"
  //   }
  // ]) as Promise<IStorageMessageView[]>;
};

const makeMessageCorpus = (messages: IStorageMessageView[]) =>
  messages.map((message) => message.content).join("\n");

const makeResponse = async (username: string) => {
  const userMessages = await fetchMessagesForUsername(username);

  if (userMessages.length === 0) {
    return `sry känner inte igen **${username}** :(  testa annat username?`;
  }

  const corpus = makeMessageCorpus(userMessages);
  const numWords = 10 + randomInt(20);
  const prefixLength = 2;
  const tokens = tokenize(corpus);
  const map = build(tokens, prefixLength);

  const generatedMessages = [`**${username}:**`];

  for (let i = 0; i < 5; i++) {
    generatedMessages.push(generate(randomInt, map, numWords, true));
  }

  return generatedMessages.join("\n\n");
};

const respond: IHandlerProcess = async (
  bot,
  logger,
  { channelID, message, evt }
) => {
  const targetUserName = message.substring("!prata ".length);
  bot.sendMessage({
    message: await makeResponse(targetUserName),
    to: channelID
  });
};

interface IStorageMessageView {
  author_id: snowflake;
  author_username: string;
  content: string;
  id: snowflake;
  timestamp: ISO8601Timestamp;
}

const toStorageMessageView = (messageObject: IMessageObject) =>
  ({
    author_id: messageObject.author.id,
    author_username: messageObject.author.username,
    content: messageObject.content,
    id: messageObject.id,
    timestamp: messageObject.timestamp
  } as IStorageMessageView);

const recordMessage: IHandlerProcess = (bot, logger, channelMessage) => {
  const messageView = toStorageMessageView(channelMessage.evt.d);
};

export default {
  name: "prata",

  applicable: (bot, logger, channelMessage) =>
    shouldRespond(channelMessage) || shouldRecordMessage(channelMessage),

  process: (bot, logger, channelMessage) => {
    if (shouldRespond(channelMessage)) {
      respond(bot, logger, channelMessage);
    } else if (shouldRecordMessage(channelMessage)) {
      recordMessage(bot, logger, channelMessage);
    }
  }
} as IHandler;

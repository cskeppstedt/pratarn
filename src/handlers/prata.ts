import { SlashCommandBuilder } from "discord.js";
import { buildMap, generateSentence, tokenizeParagraphs } from "oh-hi-markov";
import {
  ICommandHandler,
  IHandleCommand,
  IHandleMessage,
  IMessageHandler,
  IPratarnLogger,
  IStorageMessageView,
} from "../types";
import {
  fetchMessageObjectsCached,
  insertMessageObject,
} from "../utils/dynamo";
import normalizeUsername from "../utils/normalize_username";
import randomInt from "../utils/random_int";
import shouldRecordMessage from "../utils/should_record_message";
import toStorageMessageView, {
  getAuthorUsername,
} from "../utils/to_storage_message_view";

const getUsernameFromMessage = (message: string) =>
  message
    .replace(/(--\w+)/g, "")
    .substr("!prata".length)
    .trim();

const getShowStats = (message: string) => message.includes("--stats");

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

  const stats = `[ ${[
    `markov params for ${username}`,
    `${messageObjects.length} messages`,
    `${Object.keys(map).length} map keys`,
    `target: ${numSentences} sentences, ${numWords} words, prefix length ${prefixLength}`,
  ].join(" - ")} ]`;

  logger.verbose(`[prata] ${stats}`);

  const generatedMessages = [`**${username}:**`];
  if (showStats) {
    generatedMessages.push(stats);
  }

  for (let i = 0; i < numSentences; i += 1) {
    generatedMessages.push(
      generateSentence({ tokenMap: map, maxLength: numWords, prefixLength })
    );
  }

  return generatedMessages.join("\n\n");
};

const respond: IHandleCommand = async (bot, logger, interaction) => {
  try {
    const targetUserName = interaction.options.get("user")?.user?.username;
    if (!targetUserName) {
      return;
    }

    await interaction.deferReply();
    const showStats = false;
    const responseMessage = await makeResponse(
      logger,
      targetUserName,
      showStats
    );
    logger.info(
      `[prata] responding to message ${interaction.id} for username ${targetUserName}`
    );
    interaction.editReply({ content: responseMessage });
  } catch (err: any) {
    logger.error(`[prata] error occurred, possible throttling - ${err}`);
    console.error(err);
    interaction.editReply({ content: err?.message || "Error :(" });
  }
};

const recordMessage: IHandleMessage = (bot, logger, message) => {
  const messageView = toStorageMessageView(message);
  logger.info(
    `[prata] recording message - ${message.author.username} - ${messageView.id}`
  );
  return insertMessageObject(messageView);
};

const NAME = "prata";

const prata: ICommandHandler & IMessageHandler = {
  name: NAME,

  command: new SlashCommandBuilder()
    .setName(NAME)
    .setDescription(
      "generate markov chain text for a username, e.g.: !prata skepparn"
    )
    .addUserOption((opt) =>
      opt
        .setName("user")
        .setDescription("the username that should prata")
        .setRequired(true)
    ),

  handleCommand: async (bot, logger, interaction) => {
    return respond(bot, logger, interaction);
  },

  handleMessage: async (bot, logger, message) => {
    if (shouldRecordMessage(message)) {
      return recordMessage(bot, logger, message);
    }
  },
};

export default prata;

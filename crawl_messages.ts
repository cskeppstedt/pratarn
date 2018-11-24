import Discord from "discord.io";
import { IMessageObject, IStorageMessageView, snowflake } from "./types";
import chunk from "./utils/chunk";
import { insertMessageObjects } from "./utils/dynamo";
import logger from "./utils/logger";
import shouldRecordMessage from "./utils/should_record_message";
import toStorageMessageView from "./utils/to_storage_message_view";

const fetchMessages = (
  bot: Discord.Client,
  channelId: snowflake,
  before?: snowflake
) => {
  return new Promise((resolve, reject) => {
    bot.getMessages(
      { before, channelID: channelId, limit: 100 },
      (err, response) => {
        if (err) {
          reject(err);
        } else {
          resolve(response);
        }
      }
    );
  }) as Promise<IMessageObject[]>;
};

const insertBatch = async (
  messages: IStorageMessageView[],
  batchId: number
) => {
  logger.info(`[crawl] inserting batch ${batchId} - ${messages.length} items`);
  try {
    const result = await insertMessageObjects(messages);
    logger.info(`[crawl] batch ${batchId} successful`);
  } catch (err) {
    logger.error(`[crawl] batch ${batchId} failed`);
    console.info("messages in batch:");
    console.info(messages);
    throw err;
  }
};

const batchMessages = (messages: IStorageMessageView[]) => {
  return chunk(messages, 25);
};

const nextBefore = (messages: IMessageObject[]) => {
  return messages[messages.length - 1].id;
};

export default async (
  bot: Discord.Client,
  channelId: snowflake,
  before?: snowflake
) => {
  logger.info("[crawl] starting");

  while (true) {
    logger.info(
      `[crawl] fetching messages in channel ${channelId} before: ${before}`
    );
    const messages = await fetchMessages(bot, channelId, before);
    logger.info(`[crawl] fetch successful, ${messages.length} items`);

    if (messages.length > 0) {
      const filteredMessages = messages
        .filter(shouldRecordMessage)
        .map(toStorageMessageView);

      if (filteredMessages.length) {
        const batches = batchMessages(filteredMessages);
        logger.info(
          `[crawl] inserting ${batches.length} batches - ${
            filteredMessages.length
          } messages`
        );
        await Promise.all(batches.map(insertBatch));
      } else {
        logger.info("[crawl] no filtered items, skipping insert");
      }

      before = nextBefore(messages);
      logger.info(`[crawl] nextBefore: ${before}`);
    } else {
      logger.info("[crawl] no more messages, stopping");
      return;
    }
  }
};

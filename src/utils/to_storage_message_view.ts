import { IMessageObject, IStorageMessageView } from "../types";
import normalizeUsername from "./normalize_username";

export default (messageObject: IMessageObject) =>
  ({
    author_id: messageObject.author.id,
    author_username: normalizeUsername(messageObject.author.username),
    channel_id: messageObject.channel_id,
    content: messageObject.content,
    id: messageObject.id,
    timestamp: messageObject.timestamp
  } as IStorageMessageView);

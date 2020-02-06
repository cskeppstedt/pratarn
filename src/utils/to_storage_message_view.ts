import { IMessageObject, IStorageMessageView } from '../types';
import normalizeUsername from './normalize_username';

export const getAuthorUsername = (messageObject: IMessageObject) => normalizeUsername(messageObject.author.username);

export default (messageObject: IMessageObject) => ({
  author_id: messageObject.author.id,
  author_username: getAuthorUsername(messageObject),
  channel_id: messageObject.channel_id,
  content: messageObject.content,
  id: messageObject.id,
  timestamp: messageObject.timestamp,
} as IStorageMessageView);

import Discord from 'discord.js';
import { IStorageMessageView } from '../types';
import normalizeUsername from './normalize_username';

export const getAuthorUsername = (message: Discord.Message) => normalizeUsername(message.author.username);

export default (message: Discord.Message) => ({
  author_id: message.author.id,
  author_username: getAuthorUsername(message),
  channel_id: message.channel.id,
  content: message.content,
  id: message.id,
  timestamp: message.createdAt.toISOString(),
} as IStorageMessageView);

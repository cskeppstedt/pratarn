import { Message } from 'discord.js';
import { IImgurGalleryImage } from '../types';
import { ISubredditGalleryOptions, randomGalleryImage } from './imgur';

export const commandDescription = ({
  subreddit,
  window,
  sort,
}: ISubredditGalleryOptions) => `links a random r/${subreddit} image from this ${window}, sorted by ${sort}`;

export const formatImgurMessage = (options: ISubredditGalleryOptions, image: IImgurGalleryImage) => {
    return `${options.sort}[${options.window}] from r/${options.subreddit} - ${image.link}`;
}

export default async (options: ISubredditGalleryOptions, message: Message) => {
  const image = await randomGalleryImage(options);
  message.reply(formatImgurMessage(options, image));
};

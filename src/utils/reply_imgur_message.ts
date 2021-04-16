import { Message } from 'discord.js';
import { ISubredditGalleryOptions, randomGalleryImage } from './imgur';

export const commandDescription = ({
  subreddit,
  window,
  sort,
}: ISubredditGalleryOptions) => `links a random r/${subreddit} image from this ${window}, sorted by ${sort}`;

export default async (options: ISubredditGalleryOptions, message: Message) => {
  const image = await randomGalleryImage(options);
  message.reply(
    `${options.sort}[${options.window}] from r/${options.subreddit} - ${image.link}`,
  );
};

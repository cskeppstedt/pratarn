import fetch from 'isomorphic-fetch';
import logger from './logger';
import MemoryCache from './memory_cache';
import randomInt from './random_int';
import { IImgurGalleryImage } from '../types';

require('dotenv').config();

const reProtocol = /^(\w+)(:\/\/.*)$/;

export interface ISubredditGalleryOptions {
  subreddit: string;
  sort?: 'time' | 'top';
  window?: 'day' | 'week' | 'month' | 'year' | 'all';
  page?: number;
}

const cacheKey = (options: ISubredditGalleryOptions) => `gallery=${options.subreddit} - sort=${options.sort} - window=${options.window} - page=${options.page}`;

const fetchGallery = async ({
  subreddit,
  sort,
  window,
  page,
}: ISubredditGalleryOptions) => {
  logger.verbose(
    `[imgur] fetching gallery ${cacheKey({
      subreddit,
      sort,
      window,
      page,
    })}`,
  );
  const response = await fetch(
    `https://api.imgur.com/3/gallery/r/${subreddit}/${sort}/${window}/${page}`,
    { headers: { Authorization: `Client-ID ${process.env.IMGUR_CLIENT_ID}` } },
  );

  if (response.status === 200) {
    const json = await response.json();
    const galleryImages = json.data as [IImgurGalleryImage];
    return galleryImages.map(galleryImage => {
      const [, protocol, rest] = (galleryImage.link || "").match(reProtocol) || [];
      if (protocol === "https") {
        return galleryImage;
      }

      const rewrittenLink = `https${rest}`;
      logger.warn(`[imgur] rewriting link due to non-https protocol "${galleryImage.link}" => "${rewrittenLink}"`)
      return { ...galleryImage, link: rewrittenLink }
    })
  }
  logger.error(
    `[imgur] bad response: ${response.status} ${response.statusText}`,
  );
  throw new Error(`bad response: ${response.status} ${response.statusText}`);
};

const galleryCache = new MemoryCache(60 * 60);

export const randomGalleryImage = async ({
  subreddit,
  sort = 'time',
  window = 'month',
  page = 0,
}: ISubredditGalleryOptions) => {
  const key = cacheKey({
    subreddit,
    sort,
    window,
    page,
  });
  const images = await galleryCache.get(key, () => fetchGallery({
    subreddit,
    sort,
    window,
    page,
  }));
  return images[randomInt(images.length - 1)];
};

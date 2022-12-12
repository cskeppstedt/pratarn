import fetch from "isomorphic-fetch";
import logger from "./logger";
import MemoryCache from "./memory_cache";
import randomInt from "./random_int";
import { IImgurGalleryImage } from "../types";
import { assertReadEnv } from "./readEnv";

require("dotenv").config();

const reProtocol = /^(\w+)(:\/\/.*)$/;

export enum GallerySort {
  time = "time",
  top = "top",
}

export enum GalleryWindow {
  day = "day",
  week = "week",
  month = "month",
  year = "year",
  all = "all",
}

export interface ISubredditGalleryOptionsInput {
  subreddit: string;
  sort?: "time" | "top";
  window?: "day" | "week" | "month" | "year" | "all";
  page?: number;
}

export type ISubredditGalleryOptions = Required<ISubredditGalleryOptionsInput>;

const cacheKey = (options: ISubredditGalleryOptions) =>
  `gallery=${options.subreddit} - sort=${options.sort} - window=${options.window} - page=${options.page}`;

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
    })}`
  );
  const response = await fetch(
    `https://api.imgur.com/3/gallery/r/${subreddit}/${sort}/${window}/${page}`,
    {
      headers: {
        Authorization: `Client-ID ${assertReadEnv("IMGUR_CLIENT_ID")}`,
      },
    }
  );

  if (response.status === 200) {
    const json = await response.json();
    const galleryImages = json.data as [IImgurGalleryImage];
    return galleryImages.map((galleryImage) => {
      const [, protocol, rest] =
        (galleryImage.link || "").match(reProtocol) || [];
      if (protocol === "https") {
        return galleryImage;
      }

      const rewrittenLink = `https${rest}`;
      logger.warn(
        `[imgur] rewriting link due to non-https protocol "${galleryImage.link}" => "${rewrittenLink}"`
      );
      return { ...galleryImage, link: rewrittenLink };
    });
  }
  logger.error(
    `[imgur] bad response: ${response.status} ${response.statusText}`
  );
  throw new Error(`bad response: ${response.status} ${response.statusText}`);
};

const galleryCache = new MemoryCache(60 * 60);

export const randomGalleryImage = async (
  optionsInput: ISubredditGalleryOptionsInput
) => {
  const options: ISubredditGalleryOptions = {
    subreddit: optionsInput.subreddit,
    sort: optionsInput.sort || "time",
    window: optionsInput.window || "month",
    page: optionsInput.page ?? 0,
  };
  const key = cacheKey(options);
  const images = await galleryCache.get(key, () => fetchGallery(options));
  const image = images[randomInt(images.length - 1)];
  return { image, options };
};

function isNonEmptyString(input: string | null | undefined): input is string {
  return input != null && input.length > 0;
}

function isValidSort(input: string | null | undefined): input is GallerySort {
  return input != null && input in GallerySort;
}

function isValidWindow(
  input: string | null | undefined
): input is GalleryWindow {
  return input != null && input in GalleryWindow;
}

export function isValidOptionsInput(
  input: Partial<ISubredditGalleryOptionsInput>
): input is ISubredditGalleryOptionsInput {
  return (
    isNonEmptyString(input.subreddit) &&
    isValidSort(input.sort) &&
    isValidWindow(input.window)
  );
}

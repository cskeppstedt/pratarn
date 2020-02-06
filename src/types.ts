import Discord from 'discord.js';
import winston from 'winston';

export type IPratarnLogger = winston.Logger;

export interface IStorageMessageView {
  author_id: snowflake;
  author_username: NormalizedUsername;
  channel_id: snowflake;
  content: string;
  id: snowflake;
  timestamp: ISO8601Timestamp;
}

export interface IFetchMessageObjectsResponse {
  count: number;
  messageObjects: IStorageMessageView[];
}

export type snowflake = string;
export type ISO8601Timestamp = string;
export type NormalizedUsername = string;

export type IHandlerApplicable = (
  bot: Discord.Client,
  logger: winston.Logger,
  channelMessage: Discord.Message
) => boolean;

export type IHandlerProcess = (
  bot: Discord.Client,
  logger: winston.Logger,
  channelMessage: Discord.Message
) => void;

export interface IHandler {
  applicable: IHandlerApplicable;
  command: string;
  description: string;
  process: IHandlerProcess;
}

export interface IImgurGalleryImage {
  /** The ID for the image */
  id: string;
  /** The title of the image. */
  title: string;
  /** Description of the image. */
  description: string;
  /** Time inserted into the gallery, epoch time */
  datetime: number;
  /** Image MIME type. */
  type: string;
  /** is the image animated */
  animated: boolean;
  /** The width of the image in pixels */
  width: number;
  /** The height of the image in pixels */
  height: number;
  /** The size of the image in bytes */
  size: number;
  /** The number of image views */
  views: number;
  /** Bandwidth consumed by the image in bytes */
  bandwidth: number;
  /** OPTIONAL, the deletehash, if you're logged in as the image owner */
  deletehash: string;
  /** The direct link to the the image. (Note: if fetching an animated GIF
   * that was over 20MB in original size, a .gif thumbnail will be returned)
   */
  link: string;
  /** OPTIONAL, The .gifv link. Only available if the image is animated and type is 'image/gif'. */
  gifv: string;
  /** OPTIONAL, The direct link to the .mp4. Only available if the image is animated and type is 'image/gif'. */
  mp4: string;
  /** OPTIONAL, The Content-Length of the .mp4. Only available if the image is animated
   * and type is 'image/gif'. Note that a zero value (0) is possible if the video has
   * not yet been generated
   */
  mp4_size: number;
  /** OPTIONAL, Whether the image has a looping animation. Only available if the image is
   * animated and type is 'image/gif'.
   */
  looping: boolean;
  /** The current user's vote on the album. null if not signed in or if the user hasn't voted on it. */
  vote: string;
  /** Indicates if the current user favorited the image. Defaults to false if not signed in. */
  favorite: boolean;
  /** Indicates if the image has been marked as nsfw or not. Defaults to null if information is not available. */
  nsfw: boolean;
  /** Number of comments on the gallery image. */
  comment_count: number;
  /** Topic of the gallery image. */
  topic: string;
  /** Topic ID of the gallery image. */
  topic_id: number;
  /** If the image has been categorized by our backend then this will contain the section the
   * image belongs in. (funny, cats, adviceanimals, wtf, etc).
   */
  section: string;
  /** The username of the account that uploaded it, or null. */
  account_url: string;
  /** The account ID of the account that uploaded it, or null. */
  account_id: number;
  /** Upvotes for the image */
  ups: number;
  /** Number of downvotes for the image */
  downs: number;
  /** Upvotes minus downvotes */
  points: number;
  /** Imgur popularity score */
  score: number;
  /** If it's an album or not */
  is_album: boolean;
  /** Indicates if the image is in the most viral gallery or not. */
  in_most_viral: boolean;
}

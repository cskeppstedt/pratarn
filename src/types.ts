import Discord from "discord.io";
import winston from "winston";

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

export enum MessageType {
  DEFAULT = 0,
  RECIPIENT_ADD = 1,
  RECIPIENT_REMOVE = 2,
  CALL = 3,
  CHANNEL_NAME_CHANGE = 4,
  CHANNEL_ICON_CHANGE = 5,
  CHANNEL_PINNED_MESSAGE = 6,
  GUILD_MEMBER_JOIN = 7
}

export type snowflake = string;
export type ISO8601Timestamp = string;
export type NormalizedUsername = string;

export interface IUserObject {
  /** snowflake	the user's id	identify */
  id: snowflake;
  /** the user's username, not unique across the platform	identify */
  username: string;
  /** the user's 4-digit discord-tag	identify */
  discriminator: string;
  /** the user's avatar hash	identify */
  avatar?: string;
  /** whether the user belongs to an OAuth2 application	identify */
  bot?: boolean;
  /** whether the user has two factor enabled on their account	identify */
  mfa_enabled?: boolean;
  /** the user's chosen language option	identify */
  locale?: string;
  /** 	whether the email on this account has been verified	email */
  verified?: boolean;
  /** the user's email	email */
  email?: string;
}

export interface IGuildMember {
  /** this users guild nickname (if one is set) */
  nick?: string;
  /** array of snowflakes	array of role object ids */
  roles: [snowflake];
  /** ISO8601 timestamp	when the user joined the guild */
  joined_at: ISO8601Timestamp;
  /** whether the user is deafened */
  deaf: boolean;
  /** whether the user is muted */
  mute: boolean;
}

export interface IMessageObject {
  /** snowflake id of the message */
  id: snowflake;
  /** snowflake	id of the channel the message was sent in */
  channel_id: snowflake;
  /** snowflake id of the guild the message was sent in */
  guild_id?: snowflake;
  /**
   * The author of this message (not guaranteed to be a valid user).
   * The author object follows the structure of the user object, but is only a
   * valid user in the case where the message is generated by a user or bot user.
   * If the message is generated by a webhook, the author object corresponds to
   * the webhook's id, username, and avatar. You can tell if a message is
   * generated by a webhook by checking for the webhook_id on the message object.
   */
  author: IUserObject;
  /** partial guild member object	member properties for this message's author */
  member?: IGuildMember;
  /** contents of the message */
  content: string;
  /** ISO8601 timestamp	when this message was sent */
  timestamp: ISO8601Timestamp;
  /** ISO8601 timestamp	when this message was edited (or null if never) */
  edited_timestamp?: ISO8601Timestamp;
  /** whether this was a TTS message */
  tts: boolean;
  /** whether this message mentions everyone */
  mention_everyone: boolean;
  /** array of user objects, with an additional partial member field	users specifically mentioned in the message */
  mentions: [IUserObject];
  /** array of role object ids	roles specifically mentioned in this message */
  mention_roles: [snowflake];
  /** array of attachment objects	any attached files */
  attachments: [any];
  /** array of embed objects	any embedded content */
  embeds: [any];
  /** array of reaction objects	reactions to the message */
  reactions?: [any];
  /** snowflake	used for validating a message was sent */
  nonce?: snowflake;
  /** whether this message is pinned */
  pinned: boolean;
  /** snowflake	if the message is generated by a webhook, this is the webhook's id */
  webhook_id?: snowflake;
  /** integer	type of message */
  type: MessageType;
  /** message activity object	sent with Rich Presence-related chat embeds */
  activity?: any;
  /** message application object	sent with Rich Presence-related chat embeds */
  application?: any;
}

export interface IMessageEvent {
  d: IMessageObject;
  op: number;
  s: number;
  t: string;
}

export interface IChannelMessage {
  user: string;
  userID: string;
  channelID: string;
  message: string;
  evt: IMessageEvent;
}

export type IHandlerApplicable = (
  bot: Discord.Client,
  logger: winston.Logger,
  channelMessage: IChannelMessage
) => boolean;

export type IHandlerProcess = (
  bot: Discord.Client,
  logger: winston.Logger,
  channelMessage: IChannelMessage
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
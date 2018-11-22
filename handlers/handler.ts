import Discord from "discord.io";
import winston from "winston";

export interface IChannelMessage {
  user: string;
  userID: string;
  channelID: string;
  message: string;
  evt: object;
}

export interface IHandler {
  applicable: (message: string) => boolean;
  name: string;
  process: (
    bot: Discord.Client,
    logger: winston.Logger,
    channelMessage: IChannelMessage
  ) => void;
}

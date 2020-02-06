import { IChannelMessage } from '../types';

const isBot = (channelMessage: IChannelMessage) => channelMessage.evt.d.author.bot === true;

export default isBot;

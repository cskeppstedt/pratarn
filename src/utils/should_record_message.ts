import { IMessageObject } from '../types';

export default (messageObject: IMessageObject) => {
  if (/^!/.test(messageObject.content)) {
    return false;
  }

  if (messageObject.author.bot === true) {
    return false;
  }

  if (messageObject.webhook_id) {
    return false;
  }

  if (
    messageObject.content === null
    || messageObject.content === undefined
    || messageObject.content === ''
  ) {
    return false;
  }

  return true;
};

import Discord from 'discord.js';

export default (messageObject: Discord.Message) => {
  if (/^!/.test(messageObject.content)) {
    return false;
  }

  if (messageObject.author.bot === true) {
    return false;
  }

  if (messageObject.webhookID) {
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

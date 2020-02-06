import Discord from 'discord.js';

const isBot = (message: Discord.Message) => message.author.bot;

export default isBot;

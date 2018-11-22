import Discord from "discord.io";
import logger from "./logger";

require("dotenv").config();

const discordAuthToken: string = process.env.DISCORD_AUTH_TOKEN || "";

if (!discordAuthToken) {
  console.error("DISCORD_AUTH_TOKEN not defined");
  process.exit(1);
}

const bot = new Discord.Client({
  token: discordAuthToken
});

bot.on("ready", () => {
  logger.info(`Connected! Logged in as: ${bot.username} - (${bot.id})`);
});

bot.on(
  "message",
  (user: any, userID: any, channelID: any, message: string, evt: any) => {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    logger.verbose(`user: ${user}`);
    logger.verbose(`userID: ${userID}`);
    logger.verbose(`channelID: ${channelID}`);
    logger.verbose(`message: ${message}`);
    logger.verbose(`evt: ${evt}`);

    if (message.substring(0, 1) === "!") {
      let args = message.substring(1).split(" ");
      const cmd = args[0];

      args = args.splice(1);
      switch (cmd) {
        // !ping
        case "carlsucks":
          bot.sendMessage({
            message: "HEJ på dig din jävel",
            to: channelID
          });
          break;
        // Just add any case commands if you want to..
      }
    }
  }
);

bot.on("disconnect", (errMsg, code) => {
  logger.info(`Disconnected. Error: ${errMsg} (code ${code})`);
});

logger.info("attempting to connect");
bot.connect();

console.log("hello 2");

setTimeout(() => {
  logger.verbose("later...");
}, 10000);

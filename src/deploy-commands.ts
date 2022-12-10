import { REST, Routes } from "discord.js";
import { assertReadEnv } from "./utils/readEnv";
import handlers from "./handlers";

const applicationId = assertReadEnv("DISCORD_APPLICATION_ID");
const token = assertReadEnv("DISCORD_AUTH_TOKEN");

const commands = [...handlers.values()].map((handler) => {
  console.log(" - serializing", handler.name);
  const serialized = (handler.command as any).toJSON();
  console.log(serialized);
  return serialized;
});

// Construct and prepare an instance of the REST module
const rest = new REST({ version: "10" }).setToken(token);

// and deploy your commands!
(async () => {
  try {
    console.log(
      `Started refreshing ${commands.length} application (/) commands.`
    );

    // The put method is used to fully refresh all commands in the guild with the current set
    const data = await rest.put(Routes.applicationCommands(applicationId), {
      body: commands,
    });
    console.log(
      `Successfully reloaded ${commands.length} application (/) commands.`
    );
  } catch (error) {
    // And of course, make sure you catch and log any errors!
    console.error(error);
  }
})();

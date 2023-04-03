require("dotenv").config({
  path: require("path").resolve(".env"),
});
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v10");

const commands = [
  {
    name: "verify",
    description: "Start a verification session.",
  },
];

const token = process.env.DISCORD_BOT_TOKEN ?? "";
const id = process.env.DISCORD_CLIENT_ID ?? "";

const rest = new REST({ version: "10" }).setToken(token); 

(async () => {
  try {
    console.log("[Discord API] Started refreshing application (/) commands.");
    await rest.put(Routes.applicationCommands(id), { body: commands });
    console.log(
      "[Discord API] Successfully reloaded application (/) commands."
    );
    process.exit(0)
  } catch (error) {
    console.error(error);
  }
})();

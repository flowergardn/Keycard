require("dotenv").config({
  path: require("path").resolve(".env"),
});
const { REST } = require("@discordjs/rest");
const {
  Routes,
  ApplicationCommandOptionType,
} = require("discord-api-types/v10");

const commands = [
  {
    name: "verify",
    description: "Start a verification session.",
  },
  {
    name: "settings",
    description: "Manage Keycard settings",
    options: [
      {
        name: "role",
        description: "Set the verification role",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "role",
            description: "The role to set",
            type: ApplicationCommandOptionType.Role,
            required: true,
          },
        ],
      },
      {
        name: "channel",
        description: "Set the verification logging channel",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "channel",
            description: "The channel to send logs into",
            type: ApplicationCommandOptionType.Channel,
            required: true,
          },
        ],
      },
    ],
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
    process.exit(0);
  } catch (error) {
    console.error(error);
  }
})();

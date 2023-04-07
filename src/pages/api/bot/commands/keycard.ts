import { CommandOptions } from "~/pages/api/bot/index";
import { InteractionResponseType, MessageFlags } from "discord-api-types/v10";
import { EmbedBuilder, codeBlock } from "@discordjs/builders";
import axios from "axios";
import { prisma } from "~/server/db";

export const execute = async (opt: CommandOptions) => {
  const { res: response } = opt;

  const embed = new EmbedBuilder().setTitle("Keycard Info");

  const servers = await axios.get(
    "https://discord.com/api/v10/users/@me/guilds",
    {
      headers: {
        Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
      },
    }
  );

  const sessions = await prisma.session.findMany();
  const accounts = await prisma.account.findMany();

  const stats = [
    `[Servers]: ${servers.data.length}`,
    `[Sessions]: ${sessions.length}`,
    `[Verified users]: ${accounts.length}`,
  ];

  embed.setDescription(codeBlock("ini", stats.join("\n")));

  response.json({
    type: InteractionResponseType.ChannelMessageWithSource,
    data: {
      embeds: [embed.toJSON()],
      flags: MessageFlags.Ephemeral,
    },
  });
};

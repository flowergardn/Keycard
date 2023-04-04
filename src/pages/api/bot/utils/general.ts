import axios from "axios";
import { APIEmbed, APIMessageActionRowComponent } from "discord-api-types/v10";
import { Interaction } from "~/pages/api/bot/index";
import { prisma } from "~/server/db";

interface Option {
  name: string;
  type: number;
  value: string;
}

export const getArgument = (
  interaction: Interaction,
  argument: string
): Option | null => {
  const { options } = interaction.data;
  if (!options) return null;

  const _arg = options.filter((o) => o.name === argument);
  if (_arg.length === 1) return _arg.shift() as Option;
  else return null;
};

export function parseColor(color: string) {
  let baseColor = color;
  baseColor = color.replace("#", "");
  return parseInt(baseColor, 16);
}

export async function sendLog(
  guildId: string,
  log: {
    content?: string;
    embeds?: APIEmbed[];
    components?: APIMessageActionRowComponent[];
  }
) {
  const server = await prisma.server.findFirst({
    where: {
      id: guildId,
    },
  });

  if (!server || !server?.loggingChannel) return;

  await axios.post(
    `https://discord.com/api/v10/channels/${server.loggingChannel}/messages`,
    log,
    {
      headers: {
        Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
      },
    }
  );
}

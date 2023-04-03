import { CommandOptions } from "~/pages/api/bot/index";
import {
  InteractionResponseType,
  MessageFlags,
  ButtonStyle,
  APIGuildMember,
} from "discord-api-types/v10";
import { createTRPCContext } from "~/server/api/trpc";
import { appRouter } from "~/server/api/root";
import { EmbedBuilder, ButtonBuilder } from "@discordjs/builders";

function parseColor(color: string) {
  let baseColor = color;
  baseColor = color.replace("#", "");
  return parseInt(baseColor, 16);
}

export const execute = async (opt: CommandOptions) => {
  const { res: response, req: request } = opt;

  const ctx = createTRPCContext({ req: request, res: response });
  const trpc = appRouter.createCaller(ctx);

  const member = request.body.member as APIGuildMember;

  const session = await trpc.sessions.create({
    discordId: member.user?.id ?? "",
  });

  const embed = new EmbedBuilder()
    .setTitle("Server verification")
    .setColor(parseColor("#2b2d31"));

  embed.setDescription(
    "This server uses [Keycard](https://github.com/astridlol/Keycard) to make sure people are who they say they are.\nClick the button below to begin your verification session."
  );

  embed.setFooter({
    text: "Keycard is completely open source <3",
  });

  const button = new ButtonBuilder()
    .setStyle(ButtonStyle.Link)
    .setLabel("Verify")
    .setURL(`https://127.0.0.1:3001/v/${session.id}`);

  response.json({
    type: InteractionResponseType.ChannelMessageWithSource,
    data: {
      embeds: [embed.toJSON()],
      components: [
        {
          type: 1,
          components: [button.toJSON()],
        },
      ],
      flags: MessageFlags.Ephemeral,
    },
  });
};

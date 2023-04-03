import { CommandOptions } from "~/pages/api/bot/index";
import {
  InteractionResponseType,
  MessageFlags,
  APIInteractionGuildMember,
} from "discord-api-types/v10";
import { calculate } from "discord-permission";
import { prisma } from "~/server/db";

export const execute = async (opt: CommandOptions) => {
  const { res: response, req: request } = opt;

  const { body } = request;

  const member = request.body.member as APIInteractionGuildMember;

  const canManage = calculate("MANAGE_GUILD", parseInt(member.permissions));

  if (!canManage) {
    return response.json({
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        content:
          "You're forbidden from accessing this servers Keycard settings.",
        flags: MessageFlags.Ephemeral,
      },
    });
  }

  const setting = body.data.options.shift();

  console.log(setting.name);

  switch (setting.name) {
    case "role": {
      await prisma.server.upsert({
        where: {
          id: body.guild_id,
        },
        update: {
          verificationRole: setting.options[0].value,
        },
        create: {
          id: body.guild_id,
          verificationRole: setting.options[0].value,
        },
      });

      response.json({
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
          content: `Verification role set to <@&${setting.options[0].value}>`,
          flags: MessageFlags.Ephemeral,
        },
      });
      break;
    }
    case "channel": {
      await prisma.server.upsert({
        where: {
          id: body.guild_id,
        },
        update: {
          loggingChannel: setting.options[0].value,
        },
        create: {
          id: body.guild_id,
          loggingChannel: setting.options[0].value,
        },
      });

      response.json({
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
          content: `Logging channel set to <#${setting.options[0].value}>`,
          flags: MessageFlags.Ephemeral,
        },
      });
      break;
    }
  }
};

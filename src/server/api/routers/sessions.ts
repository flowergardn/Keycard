import { EmbedBuilder, inlineCode, userMention } from "@discordjs/builders";
import { Account } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import axios from "axios";
import {
  APIEmbedField,
  RESTGetAPIGuildMemberResult,
} from "discord-api-types/v10";
import { z } from "zod";
import { parseColor, sendLog, hash } from "~/pages/api/bot/utils/general";
import * as async from "async";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

function verifyCaptcha(token: string) {
  return axios
    .post(
      `https://challenges.cloudflare.com/turnstile/v0/siteverify`,
      {
        response: token,
        secret: process.env.TURNSTILE_SECRET_KEY,
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    )
    .then((resp) => {
      if (resp?.data) return resp?.data;
      else
        throw new TRPCError({
          code: "BAD_REQUEST",
          cause: "Failed to verify captcha",
        });
    })
    .catch((err) => {
      console.log(err);
    });
}

// Function to parse through an array list of alts, and only return the ones present in the current server.
async function checkAlts(accounts: Account[], guildId: string) {
  const alts: RESTGetAPIGuildMemberResult[] = [];

  await async.each(accounts, async function (data) {
    const url = `https://discord.com/api/v10/guilds/${guildId}/members/${data.id}`;

    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
        },
      });

      if (response.ok) {
        const body = await response.json();
        console.log(`Response for ID ${data.id}: ${body}`);

        alts.push(body);
      }
    } catch (err) {
      console.error(err);
    }
  });

  return alts;
}

export const sessionRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.object({ discordId: z.string(), serverId: z.string() }))
    .query(async ({ input, ctx }) => {
      const session = await ctx.prisma.session.create({
        data: {
          discordId: input.discordId,
          serverId: input.serverId,
        },
      });
      return session;
    }),
  fetch: publicProcedure
    .input(z.object({ sessionId: z.string() }))
    .query(async ({ input, ctx }) => {
      const session = await ctx.prisma.session.findFirst({
        where: {
          id: input.sessionId,
        },
      });
      return session;
    }),
  verify: publicProcedure
    .input(
      z.object({
        sessionId: z.string(),
        captchaToken: z.string(),
        ip: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      await verifyCaptcha(input.captchaToken);

      const ip = hash(input.ip);

      const session = await ctx.prisma.session.findFirst({
        where: {
          id: input.sessionId,
        },
      });

      if (!session || !session.serverId) {
        throw new TRPCError({
          code: "NOT_FOUND",
          cause: "Could not find session",
        });
      }

      if (session.completed) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          cause: "This session token was already used before.",
        });
      }

      const server = await ctx.prisma.server.findFirst({
        where: {
          id: session.serverId,
        },
      });

      if (!server) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          cause: "Could not find the server within the database.",
        });
      }

      await axios.put(
        `https://discord.com/api/v10/guilds/${session.serverId}/members/${session.discordId}/roles/${server.verificationRole}`,
        undefined,
        {
          headers: {
            "X-Audit-Log-Reason": `Verified successfully`,
            Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
          },
        }
      );

      await ctx.prisma.session.update({
        where: {
          id: input.sessionId,
        },
        data: {
          completed: true,
        },
      });

      // upsert to update the users IP if it exists, otherwise just create it.
      await ctx.prisma.account.upsert({
        where: {
          id: session.discordId,
        },
        update: {
          ip,
        },
        create: {
          ip,
          id: session.discordId,
        },
      });

      const alts = await ctx.prisma.account.findMany({
        where: {
          ip,
        },
      });

      const successEmbed = new EmbedBuilder()
        .setColor(parseColor("#9beba7"))
        .setTimestamp(Date.now())
        .setTitle("User Verified");

      const fields: APIEmbedField[] = [
        {
          name: "User",
          value:
            `${userMention(session.discordId)} ` +
            inlineCode(`(${session.discordId})`),
        },
      ];

      const altsInServer = await checkAlts(alts, session.serverId);

      if (altsInServer.length > 1) {
        const altAmount = altsInServer.length
        const hasMultipleAlts = altAmount > 1

        console.log(JSON.stringify(altsInServer, null, 4));
        successEmbed.setDescription(
          `This user has ${altAmount} alt${hasMultipleAlts ? "s" : ""}.`   
        );

        const formattedAlts = altsInServer.map(
          (alt) =>
            alt.user &&
            `${alt.user.username}#${alt.user.discriminator} (${inlineCode(
              alt.user.id
            )})`
        );

        fields.push({
          name: "Alts",
          value: formattedAlts.join("\n"),
        });
      }

      successEmbed.addFields(fields);

      sendLog(session.serverId, { embeds: [successEmbed.toJSON()] });

      return {
        success: true,
      };
    }),
});

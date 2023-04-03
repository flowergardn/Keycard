import { TRPCError } from "@trpc/server";
import axios from "axios";
import { z } from "zod";

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
    .input(z.object({ sessionId: z.string(), captchaToken: z.string() }))
    .mutation(async ({ input, ctx }) => {
      await verifyCaptcha(input.captchaToken);

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

      // todo: send log to the specified server logging channel

      return {
        success: true,
      };
    }),
});

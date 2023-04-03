import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const sessionRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.object({ discordId: z.string() }))
    .query(async ({ input, ctx }) => {
      const session = await ctx.prisma.session.create({
        data: {
          discordId: input.discordId,
        },
      });

      return session
    }),
});

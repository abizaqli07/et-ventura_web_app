import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const homeRouter = createTRPCRouter({
  getProfile: protectedProcedure
    .query(async({ ctx }) => {
      const email = ctx.session.user.email

      if(!email){
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Unauthorize user"
        })
      }

      const user = await ctx.prisma.user.findUnique({
        where: {
          email: email
        },
        include: {
          profile: true
        }
      })

      if(!user){
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User doesnt exist"
        })
      }

      return user;

    }),
});
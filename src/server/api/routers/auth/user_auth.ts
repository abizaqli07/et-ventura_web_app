import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { hash } from "bcrypt"
import { RegisterProfileSchema, RegisterSchema } from "~/components/types/user_auth";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const userAuthRouter = createTRPCRouter({
  register: publicProcedure
    .input(RegisterSchema)
    .mutation(async ({ input, ctx }) => {

      const haveUser = await ctx.prisma.user.findUnique({
        where: {
          email: input.email
        }
      });

      if (haveUser) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "User already exist"
        })
      }

      const hashed = await hash(input.password, 10);

      const user = await ctx.prisma.user.create({
        data: {
          email: input.email,
          password: hashed
        }
      })

      return user

    }),
  createProfile: publicProcedure
    .input(RegisterProfileSchema)
    .mutation(async ({ input, ctx }) => {

      const profile = await ctx.prisma.userProfile.upsert({
        create: {
          username: input.username,
          name: input.name,
          phone: input.phone,
          address: input.address,
          city: input.city,
          country: input.country,
          postCode: Number(input.postCode),
          biography: input.biography,
          interest: input.interest,
          skills: input.skills,
          userId: input.userId,
        },
        update: {
          username: input.username,
          name: input.name,
          phone: input.phone,
          address: input.address,
          city: input.city,
          country: input.country,
          postCode: Number(input.postCode),
          biography: input.biography,
          interest: input.interest,
          skills: input.skills,
        },
        where: {
          userId: input.userId
        }
      });

      if (profile) {
        const update = await ctx.prisma.user.update({
          where: {
            id: input.userId
          },
          data: {
            role: input.role
          }
        })
      }

      return profile

    })
});
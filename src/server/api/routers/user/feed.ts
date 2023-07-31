import { PROJECTSTATUS, Prisma } from "@prisma/client";
import { inferAsyncReturnType } from "@trpc/server";
import { z } from "zod";
import { FeedSchema } from "~/components/types/entrepreneur_feed";
import { createTRPCContext, createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const feedRouter = createTRPCRouter({
  infiniteFeed: protectedProcedure
    .input(z.object({
      limit: z.number().optional(),
      cursor: z.object({
        id: z.string(),
        createdAt: z.date()
      }).optional(),
    }))
    .query(async ({ input: { limit = 10, cursor }, ctx }) => {
      const currentUserId = ctx.session?.user.id;

      return await getInfiniteTweets({
        limit, ctx, cursor
      })
    }),
  create: protectedProcedure
    .input(FeedSchema)
    .mutation(async ({ input, ctx }) => {
      const feed = await ctx.prisma.project.create({
        data: {
          title: input.title,
          description: input.description,
          image: input.image,
          status: PROJECTSTATUS.PUBLIC,
          userId: ctx.session.user.id
        }
      })

      return feed;
    }),
});

// ============ Infinite Feed Function =============== //
async function getInfiniteTweets({
  ctx,
  limit,
  cursor,
}: {
  whereClause?: Prisma.ProjectWhereInput;
  limit: number;
  cursor: { id: string; createdAt: Date } | undefined;
  ctx: inferAsyncReturnType<typeof createTRPCContext>;
}) {
  const currentUserId = ctx.session?.user.id;

  const data = await ctx.prisma.project.findMany({
    take: limit + 1,
    cursor: cursor ? { createdAt_id: cursor } : undefined,
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    where: {
      status: {
        notIn: ["PRIVATE", "INVEST"]
      }
    },
    select: {
      id: true,
      title: true,
      description: true,
      image: true,
      createdAt: true,
      _count: { select: { likes: true } },
      likes:
        currentUserId == null ? false : { where: { userId: currentUserId } },
      user: {
        select: { name: true, id: true, image: true },
      },
    },
  });

  let nextCursor: typeof cursor | undefined;
  if (data.length > limit) {
    const nextItem = data.pop();
    if (nextItem != null) {
      nextCursor = { id: nextItem.id, createdAt: nextItem.createdAt };
    }
  }

  return {
    projects: data.map((project) => {
      return {
        id: project.id,
        title: project.title,
        description: project.description,
        image: project.image,
        createdAt: project.createdAt,
        likeCount: project._count.likes,
        user: project.user,
        likedByMe: project.likes?.length > 0,
      };
    }),
    nextCursor,
  };
}
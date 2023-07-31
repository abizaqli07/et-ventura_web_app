import { createTRPCRouter } from "~/server/api/trpc";
import { adminRouter } from "~/server/api/routers/admin/admin";
import { entrepreneurRouter } from "~/server/api/routers/user/entrepreneur";
import { userAuthRouter } from "~/server/api/routers/auth/user_auth";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  entrepreneur: entrepreneurRouter,
  admin: adminRouter,
  auth: userAuthRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;

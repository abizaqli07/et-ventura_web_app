import { createTRPCRouter } from "~/server/api/trpc";
import { dashboardRouter } from "./dashboard";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const adminRouter = createTRPCRouter({
  example: dashboardRouter,
});
import { createTRPCRouter } from "~/server/api/trpc";
import { homeRouter } from "./home";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const clientRouter = createTRPCRouter({
  example: homeRouter,
});
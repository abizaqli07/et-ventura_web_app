import { createTRPCRouter } from "~/server/api/trpc";
import { homeRouter } from "./home";
import { feedRouter } from "./feed";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const entrepreneurRouter = createTRPCRouter({
  home: homeRouter,
  feed: feedRouter,
});
import { createTRPCRouter } from "../trpc";
import { worldRouter } from "./world";
import { levelRouter } from "./level";
import { submissionRouter } from "./submission";
import { userRouter } from "./user";

/**
 * Main tRPC Application Router
 * Merges all sub-routers following the API specification:
 * 
 * - world.list
 * - world.getLevels
 * - level.getChallenges
 * - submission.submit
 * - submission.getProgress
 * - user.getProfile
 */
export const appRouter = createTRPCRouter({
  world: worldRouter,
  level: levelRouter,
  submission: submissionRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter;

import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { getChallengesByLevelId } from "../db";

/**
 * Level Router
 * Handles level-specific queries
 */
export const levelRouter = createTRPCRouter({
  /**
   * level.getChallenges
   * Returns challenge definitions for a given level
   * Input: { levelId: string }
   */
  getChallenges: publicProcedure
    .input(z.object({ levelId: z.string().uuid() }))
    .query(async ({ input }) => {
      const challenges = await getChallengesByLevelId(input.levelId);
      return challenges;
    }),
});


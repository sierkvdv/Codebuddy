import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import {
  getAllWorlds,
  getWorldById,
  getLevelsByWorldId,
  getUserProgress,
  getChallengesByLevelId,
} from "../db";

/**
 * World Router
 * Handles world and level queries
 */
export const worldRouter = createTRPCRouter({
  /**
   * world.list
   * Returns all worlds with progress summary for the authenticated user
   */
  list: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.user.id;
    const worlds = await getAllWorlds();
    const userProgress = await getUserProgress(userId);

    // Calculate progress summary for each world
    const worldsWithProgress = await Promise.all(
      worlds.map(async (world) => {
        const levels = await getLevelsByWorldId(world.id);
        const levelIds = new Set(levels.map((l) => l.id));

        // Count completed challenges in this world
        const completedInWorld = userProgress.filter(
          (p) => levelIds.has(p.levelId) && p.status === "completed"
        ).length;

        const totalChallenges = levels.length; // Simplified: 1 challenge per level

        return {
          ...world,
          progress: {
            completed: completedInWorld,
            total: totalChallenges,
            percentage:
              totalChallenges > 0
                ? Math.round((completedInWorld / totalChallenges) * 100)
                : 0,
          },
        };
      })
    );

    return worldsWithProgress;
  }),

  /**
   * world.getLevels
   * Returns levels for a given world with lock status for the user
   * Input: { worldId: string }
   */
  getLevels: protectedProcedure
    .input(z.object({ worldId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      const levels = await getLevelsByWorldId(input.worldId);
      const userProgress = await getUserProgress(userId);

      // Determine lock status for each level
      const levelsWithStatus = await Promise.all(
        levels.map(async (level, index) => {
          // Get challenges for this level
          const challenges = await getChallengesByLevelId(level.id);
          const challengeIds = challenges.map((c) => c.id);

          // Check if any challenge in this level is completed
          const isCompleted = challengeIds.some((cId) =>
            userProgress.some((p) => p.challengeId === cId && p.status === "completed")
          );

          // Level is locked if previous level is not completed
          let isLocked = false;
          if (index > 0) {
            const prevLevel = levels[index - 1];
            const prevChallenges = await getChallengesByLevelId(prevLevel.id);
            const prevChallengeIds = prevChallenges.map((c) => c.id);

            // Check if at least one challenge in previous level is completed
            const prevCompleted = prevChallengeIds.some((cId) =>
              userProgress.some((p) => p.challengeId === cId && p.status === "completed")
            );

            isLocked = !prevCompleted;
          }

          return {
            ...level,
            isLocked,
            isCompleted,
            challengeCount: challenges.length,
          };
        })
      );

      return levelsWithStatus;
    }),
});

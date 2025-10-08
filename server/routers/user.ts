import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { getProfileByUserId, updateProfile } from "../db";
import { TRPCError } from "@trpc/server";

/**
 * User Router
 * Handles user profile and settings
 */
export const userRouter = createTRPCRouter({
  /**
   * user.getProfile
   * Returns profile details, XP, badges, and settings
   */
  getProfile: publicProcedure.query(async () => {
    // Return a mock profile for testing
    return {
      id: "mock-user-id",
      userId: "mock-user-id",
      displayName: "Demo User",
      avatarUrl: null,
      xp: 0,
      createdAt: new Date(),
      level: 0,
    };
  }),

  /**
   * user.updateProfile
   * Updates user profile (display name, avatar)
   */
  updateProfile: protectedProcedure
    .input(
      z.object({
        displayName: z.string().optional(),
        avatarUrl: z.string().url().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;

      const updatedProfile = await updateProfile(userId, {
        displayName: input.displayName,
        avatarUrl: input.avatarUrl,
      });

      const level = Math.floor(updatedProfile.xp / 500);

      return {
        id: updatedProfile.id,
        userId: updatedProfile.userId,
        displayName: updatedProfile.displayName,
        avatarUrl: updatedProfile.avatarUrl,
        xp: updatedProfile.xp,
        level,
      };
    }),
});

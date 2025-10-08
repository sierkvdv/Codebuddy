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
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.user.id;

    const profile = await getProfileByUserId(userId);
    if (!profile) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Profile not found",
      });
    }

    // Calculate level from XP
    const level = Math.floor(profile.xp / 500);

    return {
      id: profile.id,
      userId: profile.userId,
      displayName: profile.displayName,
      avatarUrl: profile.avatarUrl,
      xp: profile.xp,
      level,
      settings: {
        // Placeholder for future settings
        theme: "light",
        soundEnabled: true,
        notificationsEnabled: true,
      },
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

import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import {
  getChallengeById,
  createSubmission,
  updateSubmissionStatus,
  updateProgress,
  incrementUserXP,
  getChallengeProgress,
  createAIFeedbackLog,
  getUserProgress,
  getProfileByUserId,
  getUserBadges,
  getAllWorlds,
  getLevelsByWorldId,
} from "../db";
import { runTests } from "@/lib/sandbox";

/**
 * Submission Router
 * Handles code submission and progress tracking
 */
export const submissionRouter = createTRPCRouter({
  /**
   * submission.submit
   * Executes validation, runs tests, stores submission, triggers AI feedback
   * Input: { challengeId: string, code: string }
   * Returns: { pass/fail, feedback, xpEarned, badgesEarned }
   */
  submit: protectedProcedure
    .input(
      z.object({
        challengeId: z.string().uuid(),
        code: z.string().min(1, "Code cannot be empty"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      const { challengeId, code } = input;

      // Get challenge with all details
      const challenge = await getChallengeById(challengeId);
      if (!challenge) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Challenge not found",
        });
      }

      // Create submission (status: pending)
      const submission = await createSubmission({
        challenge_id: challengeId,
        user_id: userId,
        code,
        status: "pending"
      });

      // Run test suite
      const testResults = runTests(code, challenge.testCases as Array<{ input: any; expectedOutput: any; description?: string }>);
      const allTestsPassed = testResults.every((t) => t.passed);

      // Determine result
      const status = allTestsPassed ? "pass" : "fail";

      // Update submission status
      await updateSubmissionStatus(submission.id, status);

      let feedback = "";
      let xpEarned = 0;
      const badgesEarned: string[] = [];

      if (allTestsPassed) {
        feedback = "🎉 Excellent work! Your code passes all tests. You've mastered this challenge!";

        // Check current progress
        const currentProgress = await getChallengeProgress(userId, challengeId);

        // Award XP only if not completed before
        if (!currentProgress || currentProgress.status !== "completed") {
          xpEarned = 100; // Base XP for completing a challenge
          await incrementUserXP(userId, xpEarned);
        }

        // Update progress to completed
        await updateProgress(userId, challenge.levelId, challengeId, "completed", 100);

        // Log AI feedback
        await createAIFeedbackLog(submission.id, userId, {
          message: feedback,
          encouragement: "Keep up the great work! 🚀",
        });
      } else {
        // Call AI feedback endpoint for failed attempts
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/ai/feedback`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                challengeContext: {
                  title: challenge.title,
                  prompt: challenge.prompt,
                },
                userCode: code,
                testResults,
              }),
            }
          );

          if (response.ok) {
            const data = await response.json();
            feedback = data.message || "Keep trying! Review the challenge requirements.";

            // Log AI feedback
            await createAIFeedbackLog(submission.id, userId, {
              message: feedback,
              hints: data.hints || [],
              encouragement: data.encouragement || "You can do it!",
            });
          } else {
            feedback = "Not quite right. Check your logic and try again!";
          }
        } catch (error) {
          console.error("AI feedback error:", error);
          feedback = "Keep practicing! Review the hints and test your code step by step.";
        }
      }

      return {
        result: status,
        feedback,
        xpEarned: allTestsPassed && xpEarned > 0 ? xpEarned : undefined,
        badgesEarned: badgesEarned.length > 0 ? badgesEarned : undefined,
        testResults,
      };
    }),

  /**
   * submission.getProgress
   * Returns user's progress for each world and level including XP and badges
   */
  getProgress: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.user.id;

    // Get user profile
    const profile = await getProfileByUserId(userId);
    if (!profile) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Profile not found",
      });
    }

    // Get user progress
    const progress = await getUserProgress(userId);

    // Get badges
    const badges = await getUserBadges(userId);

    // Calculate world progress
    const worlds = await getAllWorlds();
    const worldProgress: Record<
      string,
      {
        worldId: string;
        worldName: string;
        completed: number;
        total: number;
        percentage: number;
        levels: Array<{
          levelId: string;
          levelName: string;
          completed: number;
          total: number;
          isCompleted: boolean;
        }>;
      }
    > = {};

    for (const world of worlds) {
      const levels = await getLevelsByWorldId(world.id);

      const levelDetails = levels.map((level) => {
        // Count challenges in this level (simplified: 1 per level)
        const totalChallenges = 1;

        // Check if level is completed
        const levelProgress = progress.filter((p) => p.levelId === level.id);
        const completedChallenges = levelProgress.filter((p) => p.status === "completed").length;

        return {
          levelId: level.id,
          levelName: level.name,
          completed: completedChallenges,
          total: totalChallenges,
          isCompleted: completedChallenges >= totalChallenges,
        };
      });

      const totalInWorld = levelDetails.reduce((sum, l) => sum + l.total, 0);
      const completedInWorld = levelDetails.reduce((sum, l) => sum + l.completed, 0);

      worldProgress[world.id] = {
        worldId: world.id,
        worldName: world.name,
        completed: completedInWorld,
        total: totalInWorld,
        percentage: totalInWorld > 0 ? Math.round((completedInWorld / totalInWorld) * 100) : 0,
        levels: levelDetails,
      };
    }

    // Calculate level from XP
    const level = Math.floor(profile.xp / 500);

    return {
      xp: profile.xp,
      level,
      badges: badges.map((b) => ({
        id: b.id,
        name: b.name,
        description: b.description,
        iconUrl: b.iconUrl,
        awardedAt: b.awardedAt,
      })),
      worldProgress,
    };
  }),
});

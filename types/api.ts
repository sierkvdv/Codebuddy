import { z } from "zod";

// ============================================================================
// tRPC INPUT/OUTPUT TYPES
// ============================================================================

// World Router
export const GetWorldByIdInput = z.object({
  id: z.string().uuid(),
});

export const GetLevelsInput = z.object({
  worldId: z.string().uuid(),
});

export const GetLevelInput = z.object({
  levelId: z.string().uuid(),
});

export const GetChallengeInput = z.object({
  challengeId: z.string().uuid(),
});

export const GetChallengesForLevelInput = z.object({
  levelId: z.string().uuid(),
});

// Submission Router
export const SubmitCodeInput = z.object({
  challengeId: z.string().uuid(),
  code: z.string().min(1, "Code cannot be empty"),
});

export const SubmitCodeOutput = z.object({
  submissionId: z.string().uuid(),
  status: z.enum(["pending", "pass", "fail"]),
  feedback: z.string(),
  xpEarned: z.number().optional(),
  badgesEarned: z.array(z.string().uuid()).optional(),
  testResults: z.array(
    z.object({
      passed: z.boolean(),
      input: z.any(),
      expected: z.any(),
      actual: z.any().optional(),
      error: z.string().optional(),
    })
  ),
});

export type SubmitCodeInputType = z.infer<typeof SubmitCodeInput>;
export type SubmitCodeOutputType = z.infer<typeof SubmitCodeOutput>;

// User Router (Profile)
export const GetUserProfileOutput = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  displayName: z.string().nullable(),
  avatarUrl: z.string().nullable(),
  xp: z.number(),
  level: z.number(), // Calculated from XP
});

export const UpdateProfileInput = z.object({
  displayName: z.string().optional(),
  avatarUrl: z.string().url().optional(),
});

export const GetUserProgressOutput = z.object({
  profile: GetUserProfileOutput,
  badges: z.array(
    z.object({
      id: z.string().uuid(),
      name: z.string(),
      description: z.string(),
      iconUrl: z.string().nullable(),
      awardedAt: z.date(),
    })
  ),
  progress: z.array(
    z.object({
      challengeId: z.string().uuid(),
      levelId: z.string().uuid(),
      status: z.enum(["locked", "unlocked", "completed"]),
      score: z.number(),
    })
  ),
  worldProgress: z.record(
    z.object({
      completed: z.number(),
      total: z.number(),
      percentage: z.number(),
    })
  ),
});

export type UserProfileType = z.infer<typeof GetUserProfileOutput>;
export type UserProgressType = z.infer<typeof GetUserProgressOutput>;
export type UpdateProfileInputType = z.infer<typeof UpdateProfileInput>;

// Progress Router
export const UpdateProgressInput = z.object({
  challengeId: z.string().uuid(),
  status: z.enum(["locked", "unlocked", "completed"]),
  score: z.number().int().optional(),
});

// AI Feedback
export const AIFeedbackInput = z.object({
  code: z.string(),
  challengePrompt: z.string(),
  error: z.string().optional(),
  testResults: z.array(
    z.object({
      passed: z.boolean(),
      input: z.any(),
      expected: z.any(),
      actual: z.any().optional(),
    })
  ),
});

export const AIFeedbackOutput = z.object({
  message: z.string(),
  hints: z.array(z.string()).optional(),
  encouragement: z.string(),
});

export type AIFeedbackInputType = z.infer<typeof AIFeedbackInput>;
export type AIFeedbackOutputType = z.infer<typeof AIFeedbackOutput>;


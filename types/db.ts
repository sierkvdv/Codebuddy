import { z } from "zod";

// ============================================================================
// ENUMS
// ============================================================================

export const SubmissionStatusEnum = z.enum(["pending", "pass", "fail"]);
export type SubmissionStatus = z.infer<typeof SubmissionStatusEnum>;

export const ProgressStatusEnum = z.enum(["locked", "unlocked", "completed"]);
export type ProgressStatus = z.infer<typeof ProgressStatusEnum>;

// ============================================================================
// DATABASE SCHEMAS
// ============================================================================

// Profile Schema (user metadata and XP)
export const ProfileSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  displayName: z.string().nullable(),
  avatarUrl: z.string().url().nullable(),
  xp: z.number().int().default(0),
  createdAt: z.date(),
});

export type Profile = z.infer<typeof ProfileSchema>;

// World Schema
export const WorldSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string(),
  order: z.number().int(),
  createdAt: z.date(),
});

export type World = z.infer<typeof WorldSchema>;

// Level Schema
export const LevelSchema = z.object({
  id: z.string().uuid(),
  worldId: z.string().uuid(),
  name: z.string(),
  description: z.string(),
  levelNumber: z.number().int(),
  createdAt: z.date(),
});

export type Level = z.infer<typeof LevelSchema>;

// Challenge Schema
export const ChallengeSchema = z.object({
  id: z.string().uuid(),
  levelId: z.string().uuid(),
  title: z.string(),
  prompt: z.string(),
  starterCode: z.string().nullable(), // Starter code for beginners
  steps: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      tip: z.string(),
    })
  ).nullable(), // Step-by-step instructions
  blockDefinition: z.any().nullable(), // JSONB - block-based coding definition
  testCases: z.array(
    z.object({
      input: z.any(),
      expectedOutput: z.any(),
      description: z.string().optional(),
    })
  ).default([]),
  createdAt: z.date(),
});

export type Challenge = z.infer<typeof ChallengeSchema>;

// Submission Schema
export const SubmissionSchema = z.object({
  id: z.string().uuid(),
  challengeId: z.string().uuid(),
  userId: z.string().uuid(),
  code: z.string(),
  status: SubmissionStatusEnum,
  createdAt: z.date(),
});

export type Submission = z.infer<typeof SubmissionSchema>;

// Progress Schema
export const ProgressSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  levelId: z.string().uuid(),
  challengeId: z.string().uuid(),
  status: ProgressStatusEnum,
  score: z.number().int().default(0),
  createdAt: z.date(),
});

export type Progress = z.infer<typeof ProgressSchema>;

// Badge Schema
export const BadgeSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string(),
  iconUrl: z.string().nullable(),
  createdAt: z.date(),
});

export type Badge = z.infer<typeof BadgeSchema>;

// User Badge Schema
export const UserBadgeSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  badgeId: z.string().uuid(),
  awardedAt: z.date(),
});

export type UserBadge = z.infer<typeof UserBadgeSchema>;

// AI Feedback Log Schema
export const AIFeedbackLogSchema = z.object({
  id: z.string().uuid(),
  submissionId: z.string().uuid(),
  userId: z.string().uuid(),
  feedback: z.object({
    message: z.string(),
    hints: z.array(z.string()).optional(),
    encouragement: z.string().optional(),
  }),
  createdAt: z.date(),
});

export type AIFeedbackLog = z.infer<typeof AIFeedbackLogSchema>;


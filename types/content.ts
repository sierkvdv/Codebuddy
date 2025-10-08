import { z } from "zod";

// Content file schemas for JSON seed data

export const WorldContentSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  order: z.number(),
  icon: z.string().optional(),
  color: z.string().optional(),
});

export const LevelContentSchema = z.object({
  id: z.string(),
  worldId: z.string(),
  name: z.string(),
  description: z.string(),
  order: z.number(),
  xpReward: z.number(),
  challengeId: z.string(),
});

export const ChallengeContentSchema = z.object({
  id: z.string(),
  prompt: z.string(),
  hints: z.array(z.string()).optional(),
  starterCode: z.string().optional(),
  solution: z.string(),
  tests: z.array(
    z.object({
      input: z.any(),
      expectedOutput: z.any(),
      description: z.string().optional(),
    })
  ),
  blocks: z.array(z.string()).optional(),
});

export type WorldContent = z.infer<typeof WorldContentSchema>;
export type LevelContent = z.infer<typeof LevelContentSchema>;
export type ChallengeContent = z.infer<typeof ChallengeContentSchema>;


// Temporary mock database for initial Vercel deployment
// This will be replaced once Supabase is connected via Vercel

import type {
  World,
  Level,
  Challenge,
  Profile,
  Submission,
  Progress,
  ProgressStatus,
  SubmissionStatus,
  Badge,
  UserBadge,
  AIFeedbackLog,
} from "@/types/db";

// Mock data
const mockWorlds: World[] = [
  {
    id: "550e8400-e29b-41d4-a716-446655440001",
    name: "JavaScript Basics",
    description: "Learn the fundamentals of JavaScript programming",
    order: 1,
    createdAt: new Date(),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440002", 
    name: "Functions & Loops",
    description: "Master functions, loops, and control structures",
    order: 2,
    createdAt: new Date(),
  },
];

const mockLevels: Level[] = [
  {
    id: "550e8400-e29b-41d4-a716-446655440011",
    worldId: "550e8400-e29b-41d4-a716-446655440001",
    name: "Variables & Data Types",
    description: "Learn about variables, strings, and numbers",
    levelNumber: 1,
    createdAt: new Date(),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440012",
    worldId: "550e8400-e29b-41d4-a716-446655440001", 
    name: "Conditionals",
    description: "Master if/else statements and comparisons",
    levelNumber: 2,
    createdAt: new Date(),
  },
];

const mockChallenges: Challenge[] = [
  {
    id: "550e8400-e29b-41d4-a716-446655440021",
    levelId: "550e8400-e29b-41d4-a716-446655440011",
    title: "Hello World",
    prompt: "Create a variable called 'message' and assign it the value 'Hello, World!'",
    blockDefinition: null,
    testCases: [
      {
        input: "",
        expected: "Hello, World!",
        description: "Variable should contain the correct message"
      }
    ],
    solution: "const message = 'Hello, World!';",
    difficulty: "beginner",
    order: 1,
    createdAt: new Date(),
  },
];

const mockProfile: Profile = {
  id: "550e8400-e29b-41d4-a716-446655440031",
  userId: "mock-user-id",
  displayName: "Demo User",
  avatarUrl: null,
  xp: 150,
  createdAt: new Date(),
};

const mockBadges: Badge[] = [
  {
    id: "550e8400-e29b-41d4-a716-446655440041",
    name: "First Steps",
    description: "Complete your first challenge",
    iconUrl: "🏆",
    createdAt: new Date(),
  },
];

// Mock functions
export async function getProfileByUserId(userId: string): Promise<Profile | null> {
  return mockProfile;
}

export async function createProfile(userId: string, displayName?: string): Promise<Profile> {
  return mockProfile;
}

export async function updateProfile(
  userId: string,
  updates: { displayName?: string; avatarUrl?: string }
): Promise<Profile> {
  return mockProfile;
}

export async function incrementUserXP(userId: string, xpAmount: number): Promise<void> {
  // Mock - do nothing
}

export async function getAllWorlds(): Promise<World[]> {
  return mockWorlds;
}

export async function getWorldById(id: string): Promise<World | null> {
  return mockWorlds.find(w => w.id === id) || null;
}

export async function getLevelsByWorldId(worldId: string): Promise<Level[]> {
  return mockLevels.filter(l => l.worldId === worldId);
}

export async function getLevelById(id: string): Promise<Level | null> {
  return mockLevels.find(l => l.id === id) || null;
}

export async function getChallengesByLevelId(levelId: string): Promise<Challenge[]> {
  return mockChallenges.filter(c => c.levelId === levelId);
}

export async function getChallengeById(id: string): Promise<Challenge | null> {
  return mockChallenges.find(c => c.id === id) || null;
}

export async function createSubmission(
  userId: string,
  challengeId: string,
  code: string,
  status: SubmissionStatus
): Promise<Submission> {
  return {
    id: "mock-submission-id",
    userId,
    challengeId,
    code,
    status,
    createdAt: new Date(),
  };
}

export async function updateSubmissionStatus(
  submissionId: string,
  status: SubmissionStatus
): Promise<Submission> {
  return {
    id: submissionId,
    userId: "mock-user-id",
    challengeId: "mock-challenge-id",
    code: "mock code",
    status,
    createdAt: new Date(),
  };
}

export async function getSubmissionsByUserId(userId: string): Promise<Submission[]> {
  return [];
}

export async function getUserProgress(userId: string): Promise<Progress[]> {
  return [];
}

export async function getChallengeProgress(
  userId: string,
  challengeId: string
): Promise<Progress | null> {
  return null;
}

export async function updateProgress(
  userId: string,
  levelId: string,
  challengeId: string,
  status: ProgressStatus,
  score?: number
): Promise<Progress> {
  return {
    id: "mock-progress-id",
    userId,
    levelId,
    challengeId,
    status,
    score: score || 0,
    createdAt: new Date(),
  };
}

export async function getAllBadges(): Promise<Badge[]> {
  return mockBadges;
}

export async function getUserBadges(userId: string): Promise<Array<Badge & { awardedAt: Date }>> {
  return mockBadges.map(badge => ({
    ...badge,
    awardedAt: new Date(),
  }));
}

export async function awardBadge(userId: string, badgeId: string): Promise<void> {
  // Mock - do nothing
}

export async function createAIFeedbackLog(
  submissionId: string,
  userId: string,
  feedback: {
    message: string;
    hints?: string[];
    encouragement?: string;
  }
): Promise<AIFeedbackLog> {
  return {
    id: "mock-feedback-id",
    submissionId,
    userId,
    feedback,
    createdAt: new Date(),
  };
}

export async function getAIFeedbackLogsForSubmission(submissionId: string): Promise<AIFeedbackLog[]> {
  return [];
}

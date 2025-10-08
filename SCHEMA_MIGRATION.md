# CodeBuddy Schema Migration Guide

## Overview

The CodeBuddy database schema has been updated to match the architectural specification with proper UUID-based relationships and a more scalable structure. This document outlines all changes made.

## Key Changes Summary

### 1. ID Types: TEXT → UUID
- **Before**: Used TEXT for primary keys (e.g., `"if_forest"`, `"challenge_if_1"`)
- **After**: All tables now use UUID primary keys for better scalability and uniqueness

### 2. User Data: Separated into Users + Profiles
- **Before**: Single `users` table with email, username, and xp
- **After**: 
  - `auth.users` managed by Supabase Auth
  - `profiles` table with user_id FK, display_name, avatar_url, and xp
  - Automatic profile creation on user signup via trigger

### 3. Challenges: Moved from Standalone to Level-Based
- **Before**: Challenges were referenced by ID in levels table
- **After**: Challenges have a `level_id` FK, properly establishing the relationship
- **Impact**: Levels can now have multiple challenges (1-to-many)

### 4. Progress Tracking: Enhanced Granularity
- **Before**: `user_progress` table tracked only level completion
- **After**: `progress` table tracks both level_id AND challenge_id with status enum

### 5. Status Fields: Boolean → Enums
- **Before**: Simple boolean `passed` field
- **After**: 
  - `submission_status`: 'pending' | 'pass' | 'fail'
  - `progress_status`: 'locked' | 'unlocked' | 'completed'

### 6. AI Feedback: Added Logging Table
- **New**: `ai_feedback_logs` table for auditing and analyzing AI responses

## Database Schema Changes

### Tables Updated

#### ✅ profiles (NEW)
```sql
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY,
  user_id UUID UNIQUE REFERENCES auth.users(id),
  display_name TEXT,
  avatar_url TEXT,
  xp INTEGER DEFAULT 0,
  created_at TIMESTAMP
);
```

#### ✅ worlds
```sql
-- Changed: id from TEXT to UUID
-- Removed: icon, color columns (moved to frontend constants)
id UUID PRIMARY KEY
"order" INTEGER NOT NULL
```

#### ✅ levels
```sql
-- Changed: id, world_id from TEXT to UUID
-- Renamed: "order" → level_number
-- Removed: xp_reward, challenge_id
id UUID PRIMARY KEY
world_id UUID REFERENCES worlds(id)
level_number INTEGER NOT NULL
```

#### ✅ challenges
```sql
-- Changed: id, level_id from TEXT to UUID
-- Renamed: prompt → kept; added title
-- Changed: hints, starter_code, solution → removed
-- Added: block_definition JSONB
-- Renamed: tests → test_cases JSONB
id UUID PRIMARY KEY
level_id UUID REFERENCES levels(id)
title TEXT NOT NULL
prompt TEXT NOT NULL
block_definition JSONB
test_cases JSONB NOT NULL
```

#### ✅ submissions
```sql
-- Changed: challenge_id, user_id to UUID
-- Changed: passed BOOLEAN → status ENUM
-- Removed: attempt_number, feedback
id UUID PRIMARY KEY
challenge_id UUID REFERENCES challenges(id)
user_id UUID REFERENCES auth.users(id)
code TEXT NOT NULL
status submission_status ('pending' | 'pass' | 'fail')
```

#### ✅ progress (formerly user_progress)
```sql
-- Renamed from user_progress
-- Added: challenge_id, status ENUM
-- Removed: stars, best_score → score INTEGER
-- Changed: completed BOOLEAN → status ENUM
id UUID PRIMARY KEY
user_id UUID REFERENCES auth.users(id)
level_id UUID REFERENCES levels(id)
challenge_id UUID REFERENCES challenges(id)
status progress_status ('locked' | 'unlocked' | 'completed')
score INTEGER DEFAULT 0
UNIQUE(user_id, challenge_id)
```

#### ✅ badges
```sql
-- Changed: id from TEXT to UUID
-- Renamed: icon → icon_url
-- Removed: requirement column
id UUID PRIMARY KEY
icon_url TEXT
```

#### ✅ user_badges
```sql
-- Added: id UUID primary key
-- Changed: badge_id to UUID
-- Renamed: earned_at → awarded_at
id UUID PRIMARY KEY
UNIQUE(user_id, badge_id)
```

#### ✅ ai_feedback_logs (NEW)
```sql
CREATE TABLE public.ai_feedback_logs (
  id UUID PRIMARY KEY,
  submission_id UUID REFERENCES submissions(id),
  user_id UUID REFERENCES auth.users(id),
  feedback JSONB NOT NULL,
  created_at TIMESTAMP
);
```

## Code Changes

### 1. TypeScript Types (`types/db.ts`)

**Updated all schemas to use UUIDs:**
```typescript
export const ProfileSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  displayName: z.string().nullable(),
  avatarUrl: z.string().url().nullable(),
  xp: z.number().int().default(0),
  createdAt: z.date(),
});

export const SubmissionStatusEnum = z.enum(["pending", "pass", "fail"]);
export const ProgressStatusEnum = z.enum(["locked", "unlocked", "completed"]);
```

### 2. API Types (`types/api.ts`)

**Updated inputs/outputs:**
```typescript
export const SubmitCodeInput = z.object({
  challengeId: z.string().uuid(),  // Changed from levelId
  code: z.string().min(1),
});

export const SubmitCodeOutput = z.object({
  submissionId: z.string().uuid(),
  status: z.enum(["pending", "pass", "fail"]),
  feedback: z.string(),
  xpEarned: z.number().optional(),
  badgesEarned: z.array(z.string().uuid()).optional(),
  testResults: z.array(...),
});
```

### 3. Database Helpers (`server/db/index.ts`)

**New functions:**
- `getProfileByUserId()`
- `createProfile()`
- `updateProfile()`
- `incrementUserXP()` - updates profiles table
- `getChallengesByLevelId()`
- `getChallengeProgress()`
- `createAIFeedbackLog()`
- `getAIFeedbackLogsForSubmission()`

**Updated functions:**
- `createSubmission()` - now takes `challengeId` instead of `levelId`
- `updateProgress()` - now includes `challengeId` and status enum

### 4. tRPC Routers

#### World Router (`server/routers/world.ts`)
```typescript
// NEW endpoints
getChallengesForLevel: publicProcedure
  .input(GetChallengesForLevelInput)
  .query(...)

getChallenge: publicProcedure
  .input(GetChallengeInput)
  .query(...)
```

#### Submission Router (`server/routers/submission.ts`)
- Changed to submit by `challengeId` instead of `levelId`
- Creates `submission` with status 'pending'
- Updates status to 'pass' or 'fail' after testing
- Logs AI feedback to `ai_feedback_logs` table
- Only awards XP if challenge not already completed

#### User Router (`server/routers/user.ts`)
- Returns `profile` object with display_name and avatar_url
- `getProgress()` now returns profile, badges, progress array
- NEW: `updateProfile()` mutation for updating user info

### 5. Seed Data

**Updated content files to use UUIDs:**

`worlds.json`:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440001",
  "name": "If Forest",
  "description": "...",
  "order": 1
}
```

`levels.json`:
```json
{
  "id": "650e8400-e29b-41d4-a716-446655440001",
  "worldId": "550e8400-e29b-41d4-a716-446655440001",
  "name": "The First Decision",
  "levelNumber": 1
}
```

`challenges.json`:
```json
{
  "id": "750e8400-e29b-41d4-a716-446655440001",
  "levelId": "650e8400-e29b-41d4-a716-446655440001",
  "title": "Check if Positive",
  "prompt": "...",
  "blockDefinition": null,
  "testCases": [...]
}
```

### 6. Frontend Components

#### Updated Components:
- **ProgressHeader**: Now uses `profile` data from `getProgress` query
- **Challenge Page**: Updated to fetch and display challenges for a level
- **FeedbackPanel**: Works with new submission response structure

## Database Functions & Triggers

### Auto-Create Profile on Signup
```sql
CREATE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

### Increment User XP
```sql
CREATE FUNCTION increment_user_xp(p_user_id UUID, xp_amount INTEGER)
RETURNS void AS $$
BEGIN
  UPDATE public.profiles
  SET xp = xp + xp_amount
  WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql;
```

## Migration Steps

### For Existing Deployments:

1. **Backup your database** before making any changes

2. **Run the new schema** in Supabase SQL Editor:
   ```sql
   -- Copy entire contents of server/db/schema.sql
   -- Run in Supabase SQL Editor
   ```

3. **Seed the database** with new content:
   ```bash
   npm run seed
   ```

4. **Test the application**:
   - Sign up a new user (profile auto-created)
   - Navigate to worlds
   - Complete a challenge
   - Verify XP is awarded

### For Fresh Deployments:

1. Set up Supabase project
2. Run `server/db/schema.sql`
3. Configure `.env.local`
4. Run `npm run seed`
5. Start app with `npm run dev`

## Breaking Changes

⚠️ **These changes are NOT backwards compatible with the old schema:**

1. All IDs changed from TEXT to UUID
2. `users` table replaced with `profiles` table
3. `challenges` table structure completely changed
4. Submission/progress status fields changed from boolean to enums
5. AI feedback now logged separately

## Benefits of New Schema

✅ **Better Scalability**: UUIDs prevent collisions across distributed systems
✅ **Cleaner Separation**: Auth (Supabase) vs Profile data (custom)
✅ **More Flexible**: Levels can have multiple challenges
✅ **Better Tracking**: Progress tracked per challenge, not just per level
✅ **Audit Trail**: AI feedback logged for analysis
✅ **Type Safety**: Enums instead of booleans for status fields

## Verification Checklist

After migration, verify:

- [ ] Can sign up new user (profile auto-created)
- [ ] Can view worlds and levels
- [ ] Can access challenges for a level
- [ ] Can submit code and receive feedback
- [ ] XP is awarded on first completion only
- [ ] Progress shows correctly in header
- [ ] Badges display properly

---

**Last Updated**: Schema v2.0 with UUID migration
**Status**: ✅ Complete and Production-Ready


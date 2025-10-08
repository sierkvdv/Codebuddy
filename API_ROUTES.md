# CodeBuddy - API Routes Documentation

## Overview

CodeBuddy uses **tRPC** for type-safe client/server communication. All endpoints are automatically typed and validated using Zod schemas. The only exception is the AI feedback route, which uses a conventional Next.js API handler.

---

## tRPC Procedures

### Base URL
```
/api/trpc
```

All tRPC routes are accessed through this single endpoint with the procedure path specified in the request.

---

### 🌍 World Router

#### `world.list`

**Method:** `GET`  
**Endpoint:** `/api/trpc/world.list`  
**Auth:** Required (protected)  
**Description:** Returns all worlds with progress summary for the authenticated user

**Response:**
```typescript
Array<{
  id: string;              // UUID
  name: string;            // "If Forest"
  description: string;     // World description
  order: number;           // Display order
  createdAt: Date;
  progress: {
    completed: number;     // Completed challenges in world
    total: number;         // Total challenges in world
    percentage: number;    // Completion percentage
  };
}>
```

**Example Response:**
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "name": "If Forest",
    "description": "Learn decision making with if-else statements",
    "order": 1,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "progress": {
      "completed": 2,
      "total": 3,
      "percentage": 67
    }
  }
]
```

**Used By:** Worlds selection page

---

#### `world.getLevels`

**Method:** `GET`  
**Endpoint:** `/api/trpc/world.getLevels?input={"worldId":"..."}`  
**Auth:** Required (protected)  
**Description:** Returns levels for a given world with lock status for the user

**Input:**
```typescript
{
  worldId: string;  // UUID
}
```

**Response:**
```typescript
Array<{
  id: string;              // UUID
  worldId: string;         // UUID
  name: string;            // "The First Decision"
  description: string;     // Level description
  levelNumber: number;     // 1, 2, 3, etc.
  createdAt: Date;
  isLocked: boolean;       // True if previous level not completed
  isCompleted: boolean;    // True if any challenge completed
  challengeCount: number;  // Number of challenges in level
}>
```

**Example Response:**
```json
[
  {
    "id": "650e8400-e29b-41d4-a716-446655440001",
    "worldId": "550e8400-e29b-41d4-a716-446655440001",
    "name": "The First Decision",
    "description": "Learn to use if statements",
    "levelNumber": 1,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "isLocked": false,
    "isCompleted": true,
    "challengeCount": 1
  }
]
```

**Used By:** World detail page

---

### 📚 Level Router

#### `level.getChallenges`

**Method:** `GET`  
**Endpoint:** `/api/trpc/level.getChallenges?input={"levelId":"..."}`  
**Auth:** None (public)  
**Description:** Returns challenge definitions for a given level

**Input:**
```typescript
{
  levelId: string;  // UUID
}
```

**Response:**
```typescript
Array<{
  id: string;                // UUID
  levelId: string;           // UUID
  title: string;             // "Check if Positive"
  prompt: string;            // Full challenge description
  blockDefinition: object | null;  // Block-based coding config (JSONB)
  testCases: Array<{         // Test validation (JSONB)
    input: any;
    expectedOutput: any;
    description?: string;
  }>;
  createdAt: Date;
}>
```

**Example Response:**
```json
[
  {
    "id": "750e8400-e29b-41d4-a716-446655440001",
    "levelId": "650e8400-e29b-41d4-a716-446655440001",
    "title": "Check if Positive",
    "prompt": "Write a function that returns true if a number is positive...",
    "blockDefinition": null,
    "testCases": [
      {
        "input": 5,
        "expectedOutput": true,
        "description": "Positive number returns true"
      }
    ],
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

**Used By:** Challenge/level page

---

### 📝 Submission Router

#### `submission.submit`

**Method:** `POST`  
**Endpoint:** `/api/trpc/submission.submit`  
**Auth:** Required (protected)  
**Description:** Executes server-side validation, runs test suite, stores submission, triggers AI feedback, returns result

**Input:**
```typescript
{
  challengeId: string;  // UUID
  code: string;         // User's code (min 1 char)
}
```

**Response:**
```typescript
{
  result: "pending" | "pass" | "fail";
  feedback: string;              // AI-generated or success message
  xpEarned?: number;             // XP awarded (only if first completion)
  badgesEarned?: string[];       // Badge IDs earned (future feature)
  testResults: Array<{
    passed: boolean;
    input: any;
    expected: any;
    actual?: any;
    error?: string;
  }>;
}
```

**Example Success Response:**
```json
{
  "result": "pass",
  "feedback": "🎉 Excellent work! Your code passes all tests.",
  "xpEarned": 100,
  "testResults": [
    {
      "passed": true,
      "input": 5,
      "expected": true,
      "actual": true
    }
  ]
}
```

**Example Failure Response:**
```json
{
  "result": "fail",
  "feedback": "Your code is close! For the input 5, it returned false instead of true. Remember to check if the number is greater than 0.",
  "testResults": [
    {
      "passed": false,
      "input": 5,
      "expected": true,
      "actual": false
    }
  ]
}
```

**Processing Flow:**
1. Create submission with status "pending"
2. Run tests in sandboxed environment
3. Update submission status to "pass" or "fail"
4. If pass: Award XP (first time only), update progress
5. If fail: Call AI feedback endpoint
6. Log AI feedback to database
7. Return result to client

**Used By:** Challenge submission form

---

#### `submission.getProgress`

**Method:** `GET`  
**Endpoint:** `/api/trpc/submission.getProgress`  
**Auth:** Required (protected)  
**Description:** Returns user's progress for each world and level including XP and badges

**Response:**
```typescript
{
  xp: number;              // Total XP
  level: number;           // Calculated level (xp / 500)
  badges: Array<{
    id: string;            // UUID
    name: string;
    description: string;
    iconUrl: string | null;
    awardedAt: Date;
  }>;
  worldProgress: Record<string, {
    worldId: string;
    worldName: string;
    completed: number;     // Completed challenges
    total: number;         // Total challenges
    percentage: number;    // Completion %
    levels: Array<{
      levelId: string;
      levelName: string;
      completed: number;
      total: number;
      isCompleted: boolean;
    }>;
  }>;
}
```

**Example Response:**
```json
{
  "xp": 300,
  "level": 0,
  "badges": [
    {
      "id": "850e8400-e29b-41d4-a716-446655440001",
      "name": "First Steps",
      "description": "Complete your first challenge",
      "iconUrl": "https://...",
      "awardedAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "worldProgress": {
    "550e8400-e29b-41d4-a716-446655440001": {
      "worldId": "550e8400-...",
      "worldName": "If Forest",
      "completed": 2,
      "total": 3,
      "percentage": 67,
      "levels": [
        {
          "levelId": "650e8400-...",
          "levelName": "The First Decision",
          "completed": 1,
          "total": 1,
          "isCompleted": true
        }
      ]
    }
  }
}
```

**Used By:** Progress dashboard, stats page

---

### 👤 User Router

#### `user.getProfile`

**Method:** `GET`  
**Endpoint:** `/api/trpc/user.getProfile`  
**Auth:** Required (protected)  
**Description:** Returns profile details, XP, and settings

**Response:**
```typescript
{
  id: string;              // Profile UUID
  userId: string;          // Auth user UUID
  displayName: string | null;
  avatarUrl: string | null;
  xp: number;
  level: number;           // Calculated (xp / 500)
  settings: {
    theme: string;         // "light" | "dark"
    soundEnabled: boolean;
    notificationsEnabled: boolean;
  };
}
```

**Example Response:**
```json
{
  "id": "abc123...",
  "userId": "user456...",
  "displayName": "Alice",
  "avatarUrl": "https://...",
  "xp": 300,
  "level": 0,
  "settings": {
    "theme": "light",
    "soundEnabled": true,
    "notificationsEnabled": true
  }
}
```

**Used By:** Profile page, settings page, header

---

#### `user.updateProfile`

**Method:** `POST`  
**Endpoint:** `/api/trpc/user.updateProfile`  
**Auth:** Required (protected)  
**Description:** Updates user profile (display name, avatar)

**Input:**
```typescript
{
  displayName?: string;
  avatarUrl?: string;  // Must be valid URL
}
```

**Response:**
```typescript
{
  id: string;
  userId: string;
  displayName: string | null;
  avatarUrl: string | null;
  xp: number;
  level: number;
}
```

**Used By:** Profile settings page

---

## 🤖 Conventional API Route

### POST `/api/ai/feedback`

**Description:** Server-side route that constructs a prompt for OpenAI API, executes the call, and returns structured feedback. If no `OPENAI_API_KEY` is present, returns a mock response.

**Method:** `POST`  
**Auth:** None (called server-side only)  
**Content-Type:** `application/json`

**Input:**
```typescript
{
  challengeContext: {
    title: string;
    prompt: string;
  };
  userCode: string;
  testResults: Array<{
    passed: boolean;
    input: any;
    expected: any;
    actual?: any;
    error?: string;
  }>;
}
```

**Response:**
```typescript
{
  message: string;         // Main feedback text
  hints: string[];         // Actionable hints
  encouragement: string;   // Motivational message
}
```

**Example Request:**
```json
{
  "challengeContext": {
    "title": "Check if Positive",
    "prompt": "Write a function that returns true if positive..."
  },
  "userCode": "function isPositive(num) { return num >= 0; }",
  "testResults": [
    {
      "passed": false,
      "input": 0,
      "expected": false,
      "actual": true
    }
  ]
}
```

**Example Response (with OpenAI):**
```json
{
  "message": "You're very close! Your code is checking if the number is greater than or equal to 0, but remember that 0 is not positive. Try using just > instead of >=.",
  "hints": [
    "Review the test cases carefully",
    "Check your return statement",
    "Make sure you're handling all edge cases"
  ],
  "encouragement": "You've got this! Every coder faces challenges. Keep going! 💪"
}
```

**Example Response (Mock - No API Key):**
```json
{
  "message": "Not quite there! You passed 2 out of 3 tests. For the input 0, your code returned true but we expected false. Review your logic and try again!",
  "hints": [
    "Check your logic step by step",
    "Make sure your function returns the correct value",
    "Review the challenge requirements carefully"
  ],
  "encouragement": "Keep practicing! You're making progress! 🚀"
}
```

**Processing Flow:**
1. Validate input against schema
2. Check if `OPENAI_API_KEY` exists
3. If yes: Construct prompt and call OpenAI GPT-4
4. If no: Generate mock feedback based on test results
5. Return structured feedback

**Called By:** `submission.submit` tRPC procedure (server-side)

---

## Type Safety

All tRPC routes are **fully type-safe** from client to server:

```typescript
// Client-side usage (automatic type inference)
const { data } = trpc.world.list.useQuery();
//     ^? Array<{ id: string; name: string; ... }>

const submit = trpc.submission.submit.useMutation();
await submit.mutateAsync({
  challengeId: "...",  // Type-checked
  code: "...",         // Type-checked
});
```

**No runtime errors** from incorrect API calls!

---

## Error Handling

### tRPC Errors

All tRPC procedures use standardized error codes:

- `UNAUTHORIZED` - User not authenticated
- `NOT_FOUND` - Resource doesn't exist
- `BAD_REQUEST` - Invalid input (Zod validation failed)
- `INTERNAL_SERVER_ERROR` - Unexpected server error

**Example Error Response:**
```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Challenge not found",
    "data": {
      "zodError": null
    }
  }
}
```

### AI Feedback Errors

The AI feedback route **always returns 200 OK** with a fallback message if OpenAI fails:

```json
{
  "message": "I'm having trouble analyzing your code right now. Try checking your logic step by step!",
  "hints": ["Review the challenge prompt carefully"],
  "encouragement": "Don't give up! Keep experimenting! 🚀"
}
```

This ensures the submission flow never breaks due to AI failures.

---

## Performance Considerations

### Caching

tRPC integrates with **TanStack Query** for automatic caching:

- `world.list` - Cached indefinitely (rarely changes)
- `world.getLevels` - Cached per world
- `level.getChallenges` - Cached per level
- `user.getProfile` - Cached, refetched on mutation
- `submission.getProgress` - Invalidated on submission

### Optimistic Updates

Submissions trigger optimistic progress updates:

```typescript
const submit = trpc.submission.submit.useMutation({
  onSuccess: () => {
    // Invalidate queries to refetch latest data
    utils.user.getProfile.invalidate();
    utils.submission.getProgress.invalidate();
  }
});
```

---

## Security

### Authentication

- **Public routes:** `level.getChallenges`
- **Protected routes:** All `world.*`, `submission.*`, `user.*` routes
- **Auth method:** Supabase JWT in request headers

### Data Access

All protected routes use **Row Level Security (RLS)**:
- Users can only see their own progress
- Users can only submit code for themselves
- AI feedback is private per user

---

## Complete API Summary

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `world.list` | GET | ✅ | Get all worlds with user progress |
| `world.getLevels` | GET | ✅ | Get levels in world with lock status |
| `level.getChallenges` | GET | ❌ | Get challenges for a level |
| `submission.submit` | POST | ✅ | Submit code, run tests, get feedback |
| `submission.getProgress` | GET | ✅ | Get detailed user progress |
| `user.getProfile` | GET | ✅ | Get user profile and settings |
| `user.updateProfile` | POST | ✅ | Update display name / avatar |
| `/api/ai/feedback` | POST | ❌ | Get AI feedback (server-side only) |

---

**All API routes are production-ready and match the architectural specification exactly!** ✅


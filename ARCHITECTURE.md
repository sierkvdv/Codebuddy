# CodeBuddy - Architecture Documentation

## Overview

CodeBuddy is a full-stack web application for teaching absolute beginners how to code through interactive, game-like challenges. This document provides a comprehensive overview of the system architecture.

## Technology Stack

### Frontend
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **UI Library**: React 18
- **Styling**: TailwindCSS + shadcn/ui components
- **Animations**: Framer Motion
- **Code Editor**: Monaco Editor (VS Code's editor)
- **State Management**: TanStack Query (via tRPC)

### Backend
- **API Layer**: tRPC (type-safe RPC)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **AI Integration**: OpenAI GPT-4
- **Validation**: Zod schemas

### Infrastructure
- **Hosting**: Vercel (recommended) or any Next.js-compatible platform
- **Database Hosting**: Supabase Cloud
- **File Storage**: Static files served via Next.js

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Client (Browser)                     │
│  ┌────────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐ │
│  │   Pages    │  │Components│  │  Editor  │  │  Robot   │ │
│  │ (Next.js)  │  │  (React) │  │ (Monaco) │  │ (Canvas) │ │
│  └────────────┘  └──────────┘  └──────────┘  └──────────┘ │
│         │              │              │              │       │
│         └──────────────┴──────────────┴──────────────┘       │
│                        │                                      │
│                 ┌──────▼──────┐                              │
│                 │ tRPC Client │                              │
│                 └──────┬──────┘                              │
└────────────────────────┼─────────────────────────────────────┘
                         │ HTTP
                         │
┌────────────────────────▼─────────────────────────────────────┐
│                    Next.js Server                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              tRPC API Routes                          │   │
│  │  ┌──────────┐  ┌────────────┐  ┌───────────┐       │   │
│  │  │  World   │  │ Submission │  │   User    │       │   │
│  │  │  Router  │  │   Router   │  │  Router   │       │   │
│  │  └──────────┘  └────────────┘  └───────────┘       │   │
│  └──────────────────────────────────────────────────────┘   │
│                         │                                     │
│  ┌──────────────────────▼──────────────────────────────┐   │
│  │            AI Feedback Endpoint                      │   │
│  │              (OpenAI Integration)                    │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────────────────────┬──────────────────────────────────┘
                           │
              ┌────────────┴────────────┐
              │                         │
              ▼                         ▼
    ┌──────────────────┐      ┌──────────────────┐
    │    Supabase      │      │   OpenAI API     │
    │   (PostgreSQL)   │      │     (GPT-4)      │
    │   + Auth + RLS   │      │                  │
    └──────────────────┘      └──────────────────┘
```

## Data Flow

### 1. User Authentication Flow
```
User → Supabase Auth → JWT Token → Stored in Browser → 
Sent with every request → Validated by RLS policies
```

### 2. Code Submission Flow
```
User writes code in Editor → Clicks Submit →
  ↓
tRPC submission.submit mutation →
  ↓
Server receives code + levelId →
  ↓
1. Fetch level + challenge from DB
2. Run tests in sandbox (lib/sandbox.ts)
3. If failed: Call OpenAI for feedback
4. Save submission to DB
5. Update user progress & XP
  ↓
Return result to client →
  ↓
Update UI (feedback panel, XP, badges)
```

### 3. World/Level Loading Flow
```
User navigates to /worlds →
  ↓
tRPC world.getAll query →
  ↓
Fetch worlds from Supabase →
  ↓
Calculate progress per world →
  ↓
Render WorldCard components
```

## Database Schema

### Core Tables

#### users
```sql
- id (UUID, FK to auth.users)
- email (TEXT)
- username (TEXT, UNIQUE)
- xp (INTEGER, default 0)
- created_at, updated_at
```

#### worlds
```sql
- id (TEXT, PK)
- name (TEXT)
- description (TEXT)
- order (INTEGER)
- icon (TEXT)
- color (TEXT)
```

#### levels
```sql
- id (TEXT, PK)
- world_id (TEXT, FK)
- name (TEXT)
- description (TEXT)
- order (INTEGER)
- xp_reward (INTEGER)
- challenge_id (TEXT)
```

#### challenges
```sql
- id (TEXT, PK)
- prompt (TEXT)
- hints (JSONB)
- starter_code (TEXT)
- solution (TEXT)
- tests (JSONB)
- blocks (JSONB)
```

#### submissions
```sql
- id (UUID, PK)
- user_id (UUID, FK)
- level_id (TEXT, FK)
- code (TEXT)
- passed (BOOLEAN)
- feedback (TEXT)
- attempt_number (INTEGER)
- created_at
```

#### user_progress
```sql
- user_id (UUID, FK)
- level_id (TEXT, FK)
- completed (BOOLEAN)
- stars (INTEGER)
- best_score (INTEGER)
- completed_at
- PRIMARY KEY (user_id, level_id)
```

#### badges
```sql
- id (TEXT, PK)
- name (TEXT)
- description (TEXT)
- icon (TEXT)
- requirement (TEXT)
```

#### user_badges
```sql
- user_id (UUID, FK)
- badge_id (TEXT, FK)
- earned_at
- PRIMARY KEY (user_id, badge_id)
```

## Security

### Row Level Security (RLS)

All tables have RLS enabled with the following policies:

1. **Public Tables** (worlds, levels, challenges, badges):
   - Everyone can SELECT
   - Only service role can INSERT/UPDATE/DELETE

2. **User Data** (users, submissions, user_progress, user_badges):
   - Users can only SELECT/UPDATE their own data
   - INSERT policies ensure users can only create their own records
   - Service role has full access for admin operations

### Code Sandbox

User code is executed in a restricted sandbox (`lib/sandbox.ts`):
- No access to dangerous globals (eval, Function constructor, fetch, etc.)
- Limited to safe built-ins (Math, Array, String, etc.)
- Runs in isolated scope
- Timeout protection (via test runner)

## API Routes

### tRPC Routes

#### `/api/trpc` (Main tRPC endpoint)

**world** router:
- `getAll()` - Get all worlds
- `getById(id)` - Get world by ID
- `getLevels(worldId)` - Get levels in a world
- `getLevel(levelId)` - Get level with challenge

**submission** router:
- `submit(levelId, code)` - Submit code for a level (protected)

**user** router:
- `getProgress()` - Get user's XP, badges, completion status (protected)

### REST Routes

#### `/api/ai/feedback` (POST)
Handles AI feedback generation using OpenAI.

**Input:**
```json
{
  "code": "string",
  "challenge": "string",
  "testResults": [...],
  "error": "string (optional)"
}
```

**Output:**
```json
{
  "feedback": "string",
  "encouragement": "string"
}
```

## Frontend Components

### Pages
- `app/page.tsx` - Landing page
- `app/worlds/page.tsx` - World selection
- `app/worlds/[worldId]/page.tsx` - Level selection
- `app/worlds/[worldId]/levels/[levelId]/page.tsx` - Level challenge view

### Components
- `WorldCard` - Display world with progress
- `LevelCard` - Display level with lock/completion status
- `Editor` - Monaco code editor with run/submit buttons
- `RobotSandbox` - Canvas visualization of code execution
- `FeedbackPanel` - Display AI feedback and hints
- `ProgressHeader` - XP, level, badges display

## Development Workflow

### Adding New Content

1. **New World**:
   - Add to `content/worlds.json`
   - Run `npm run seed`

2. **New Level**:
   - Create challenge in `content/challenges.json`
   - Add level to `content/levels.json`
   - Run `npm run seed`

3. **New Badge**:
   - Add to `scripts/seed.ts` badges array
   - Implement requirement logic in submission router

### Testing Flow

1. Write code in editor
2. Click "Run Code" → Sandbox executes → Robot reacts
3. Click "Submit" → Server validates → AI feedback → Update progress

## Performance Considerations

1. **Database Queries**:
   - Indexed on frequently queried fields (world_id, user_id, level_id)
   - Efficient joins using Supabase's query builder

2. **Client-Side**:
   - React Query caching for API responses
   - Framer Motion for smooth animations
   - Monaco Editor lazy-loaded

3. **API**:
   - tRPC batching for multiple queries
   - SuperJSON for efficient serialization

## Deployment Checklist

- [ ] Set up Supabase project
- [ ] Run SQL schema in Supabase
- [ ] Configure environment variables
- [ ] Seed database with content
- [ ] Deploy to Vercel
- [ ] Test authentication flow
- [ ] Test code submission and AI feedback
- [ ] Monitor OpenAI API usage

## Future Enhancements

- **Multiplayer**: Real-time coding challenges with friends
- **Leaderboards**: Global rankings by XP
- **Achievements**: More badges and milestones
- **Hints System**: Progressive hints with XP cost
- **Code History**: Review past submissions
- **Mobile Support**: Responsive design for tablets/phones
- **Offline Mode**: Practice without internet
- **Custom Worlds**: User-created challenges

## Troubleshooting

Common issues and solutions documented in `POST_BUILD.md`.

---

**Built with ❤️ for aspiring coders everywhere**


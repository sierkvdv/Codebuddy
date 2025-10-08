# CodeBuddy - Component Documentation

## Overview

This document provides detailed information about all UI components in the CodeBuddy application, their purpose, props, and usage.

---

## Component Architecture

```
components/
├── Layout.tsx           # Page scaffold with header & navigation
├── WorldCard.tsx        # Visual world representation
├── LevelCard.tsx        # Level display with lock status
├── Editor.tsx           # Code editor with block support
├── RobotSandbox.tsx     # Robot character visualization
├── FeedbackPanel.tsx    # AI feedback display
└── ProgressHeader.tsx   # XP, badges, streak display
```

---

## Layout Components

### Layout

**File:** `components/Layout.tsx`

**Purpose:** Defines the page scaffold including header with XP/badges, navigation, and main content area.

**Props:**
```typescript
interface LayoutProps {
  children: React.ReactNode;
}
```

**Features:**
- ✅ Sticky header with branding and user info
- ✅ XP progress bar with level indicator
- ✅ Badge count display
- ✅ Current streak indicator (placeholder)
- ✅ Navigation menu (Home, Worlds, Profile, Settings)
- ✅ Responsive design
- ✅ Footer with links

**Usage:**
```typescript
import Layout from "@/components/Layout";

export default function Page() {
  return (
    <Layout>
      <div>Your page content</div>
    </Layout>
  );
}
```

**Header Elements:**
- Logo/Brand
- User avatar
- Level & XP progress bar
- Total XP count
- Badge count
- Streak indicator

**Navigation Items:**
- Home (/)
- Worlds (/worlds)
- Profile (/profile)
- Settings (/settings)

---

### ProgressHeader

**File:** `components/ProgressHeader.tsx`

**Purpose:** Compact header showing user's XP bar, badges collected, and current streak.

**Props:** None (fetches data internally)

**Features:**
- ✅ Live XP progress bar
- ✅ Current level calculation (XP / 500)
- ✅ Badge count with icon
- ✅ Streak display (placeholder)
- ✅ User avatar and display name
- ✅ Responsive layout

**Data Fetching:**
```typescript
const { data: profile } = trpc.user.getProfile.useQuery();
const { data: progressData } = trpc.submission.getProgress.useQuery();
```

**Display Logic:**
- XP Bar: Shows progress within current level (0-500 XP)
- Level: Calculated as `Math.floor(xp / 500)`
- Progress Percentage: `(xp % 500) / 500 * 100`

**Usage:**
```typescript
import ProgressHeader from "@/components/ProgressHeader";

// In page component
<ProgressHeader />
```

---

## Card Components

### WorldCard

**File:** `components/WorldCard.tsx`

**Purpose:** Visual representation of a world showing name, description, and completion percentage.

**Props:**
```typescript
interface WorldCardProps {
  world: {
    id: string;
    name: string;
    description: string;
    order: number;
  };
  progress?: {
    completed: number;
    total: number;
    percentage: number;
  };
  delay?: number;  // Animation delay
}
```

**Features:**
- ✅ World icon display
- ✅ Progress bar with percentage
- ✅ Lock status indicator
- ✅ Completion checkmark
- ✅ Hover animations
- ✅ Clickable link to world detail
- ✅ Staggered entrance animations

**States:**
- **Locked:** Shows lock icon, reduced opacity
- **In Progress:** Shows progress bar
- **Completed:** Shows checkmark, 100% progress

**Usage:**
```typescript
<WorldCard
  world={world}
  progress={{
    completed: 5,
    total: 10,
    percentage: 50
  }}
  delay={0.1}
/>
```

---

### LevelCard

**File:** `components/LevelCard.tsx`

**Purpose:** Lists levels within a world with lock/unlock status.

**Props:**
```typescript
interface LevelCardProps {
  level: {
    id: string;
    name: string;
    description: string;
    levelNumber: number;
  };
  worldId: string;
  isLocked?: boolean;
  isCompleted?: boolean;
  stars?: number;       // 0-3 stars
  delay?: number;
}
```

**Features:**
- ✅ Level number badge
- ✅ Lock overlay when locked
- ✅ Star rating display
- ✅ XP reward indicator
- ✅ Completion border highlight
- ✅ Hover scale animation
- ✅ Click to level/challenge

**Lock Logic:**
- Level is locked if previous level not completed
- First level always unlocked
- Lock icon overlay prevents interaction

**Usage:**
```typescript
<LevelCard
  level={level}
  worldId={worldId}
  isLocked={false}
  isCompleted={true}
  stars={3}
  delay={0.2}
/>
```

---

## Editor & Execution Components

### Editor

**File:** `components/Editor.tsx`

**Purpose:** Monaco Editor wrapper configured for JavaScript/TypeScript with simplified toolbar, block translation support, and run/submit handlers.

**Props:**
```typescript
interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  onRun: () => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
  language?: string;             // Default: "javascript"
  theme?: string;                // Default: "vs-dark"
  blockDefinition?: any | null;  // JSONB block config
}
```

**Features:**
- ✅ Monaco Editor integration
- ✅ Syntax highlighting
- ✅ IntelliSense/autocomplete
- ✅ Simplified toolbar with window controls
- ✅ Mode toggle (text ↔ blocks)
- ✅ Block-based coding support (placeholder)
- ✅ Run Code button
- ✅ Submit button with loading state
- ✅ Line count & character count display
- ✅ Language badge

**Editor Options:**
```typescript
{
  minimap: { enabled: false },
  fontSize: 14,
  lineNumbers: "on",
  tabSize: 2,
  wordWrap: "on",
  formatOnPaste: true,
  formatOnType: true,
  quickSuggestions: true,
  bracketPairColorization: { enabled: true }
}
```

**Block Translation:**
- If `blockDefinition` provided, shows mode toggle
- Text mode: Full Monaco editor
- Block mode: Visual block editor (placeholder for future implementation)
- Translation functions: `translateBlocksToCode()`, `translateCodeToBlocks()`

**Usage:**
```typescript
<Editor
  value={code}
  onChange={setCode}
  onRun={handleRun}
  onSubmit={handleSubmit}
  isSubmitting={isLoading}
  blockDefinition={challenge.blockDefinition}
/>
```

---

### RobotSandbox

**File:** `components/RobotSandbox.tsx`

**Purpose:** Implements a visual robot character scene that listens for events from the Editor and animates based on success/failure.

**Props:**
```typescript
interface RobotSandboxProps {
  code: string;  // Code to execute (event trigger)
}
```

**Features:**
- ✅ Robot character visualization (Canvas-based)
- ✅ Event-driven animations
- ✅ State-based behavior (idle, thinking, success, error)
- ✅ Animated robot expressions
- ✅ Console output display
- ✅ Real-time code execution feedback

**Robot States:**
```typescript
type RobotState = "idle" | "thinking" | "success" | "error";
```

**Animations:**
- **Idle:** Neutral expression, still
- **Thinking:** Bounce animation, blinking antenna, thoughtful face
- **Success:** Jump celebration, big smile, waving arm
- **Error:** Shake animation, sad eyes, frown

**Robot Visual Elements:**
- Body (colored based on state)
- Eyes (animated, expression changes)
- Mouth (smile/frown/neutral)
- Antenna with blinking bulb
- Arms (wave on success)

**Console Output:**
- Shows execution logs
- Displays return values
- Shows errors in red
- Success messages in green
- Animated entry for each line

**Code Execution:**
```typescript
// Listens for code prop changes
useEffect(() => {
  if (!code) return;
  
  setRobotState("thinking");
  
  const result = runCodeInSandbox(code);
  
  if (result.success) {
    setRobotState("success");
    setOutput(result.logs);
  } else {
    setRobotState("error");
    setOutput([...result.logs, result.error]);
  }
}, [code]);
```

**Usage:**
```typescript
const [sandboxCode, setSandboxCode] = useState("");

// Trigger execution
const handleRun = () => setSandboxCode(userCode);

// Render
<RobotSandbox code={sandboxCode} />
```

**Future Enhancement: PixiJS**
Current implementation uses Canvas2D. Future versions will use PixiJS for:
- Better performance
- More complex animations
- Particle effects
- Interactive robot

---

### FeedbackPanel

**File:** `components/FeedbackPanel.tsx`

**Purpose:** Displays AI feedback returned by the server including verdict, issues, hints, next steps, and encouragement.

**Props:**
```typescript
interface FeedbackPanelProps {
  feedback?: string;     // Main AI feedback message
  isLoading?: boolean;   // Loading state
  success?: boolean;     // Pass/fail verdict
  testResults?: Array<{  // Test case results
    passed: boolean;
    input: any;
    expected: any;
    actual?: any;
    error?: string;
  }>;
}
```

**Features:**
- ✅ Verdict display (pass/fail with icons)
- ✅ Test results summary
- ✅ Issues section (failed tests breakdown)
- ✅ Hints section (AI-generated tips)
- ✅ Next steps section (actionable advice)
- ✅ Encouragement message
- ✅ Loading animation
- ✅ Empty state

**Feedback Sections:**

1. **Verdict**
   - Green success banner with checkmark
   - Orange/red failure banner with X icon
   - Test pass rate: "X / Y tests passed"

2. **Issues** (shown on failure)
   - Red-bordered section
   - Lists failed tests (up to 3)
   - Shows input, expected, actual values
   - Displays error messages

3. **Main Feedback**
   - AI-generated explanation
   - Beginner-friendly language
   - No technical jargon

4. **Hints** (blue section)
   - Specific tips from AI
   - Bullet point format
   - Lightbulb icons

5. **Next Steps** (purple section)
   - Actionable steps
   - "What to try next"
   - Arrow icons

6. **Encouragement** (pink/green section)
   - Motivational message
   - Heart icon
   - Context-appropriate (success vs. keep trying)

**Usage:**
```typescript
<FeedbackPanel
  feedback="Your code is close! Try checking if the number is greater than 0..."
  isLoading={false}
  success={false}
  testResults={[
    {
      passed: true,
      input: 5,
      expected: true,
      actual: true
    },
    {
      passed: false,
      input: 0,
      expected: false,
      actual: true
    }
  ]}
/>
```

**States:**
- **Loading:** Spinning loader with "Analyzing..." text
- **Empty:** Robot illustration with call-to-action
- **Success:** Green theme, celebration message
- **Failure:** Orange/red theme, helpful breakdown

---

## Page Components

### WorldMapPage

**File:** `app/worlds/page.tsx`

**Purpose:** Page component that fetches worlds via tRPC and renders WorldCard components.

**Features:**
- ✅ Fetches all worlds with user progress
- ✅ Grid layout of WorldCard components
- ✅ Loading state
- ✅ Staggered animations
- ✅ Progress header integration

**Data Fetching:**
```typescript
const { data: worlds, isLoading } = trpc.world.list.useQuery();
```

**Data Structure:**
```typescript
worlds: Array<{
  id: string;
  name: string;
  description: string;
  order: number;
  progress: {
    completed: number;
    total: number;
    percentage: number;
  };
}>
```

**Layout:**
- Container with max-width
- Responsive grid (1 col mobile, 2 col tablet, 3 col desktop)
- Gap spacing between cards
- Centered title

---

### LevelPage

**File:** `app/worlds/[worldId]/levels/[levelId]/page.tsx`

**Purpose:** Page component that fetches level data and challenges, embeds Editor, RobotSandbox, and FeedbackPanel.

**Features:**
- ✅ Fetches level and challenges
- ✅ Two-column layout
- ✅ Challenge description
- ✅ Multi-challenge support (selector)
- ✅ Integrated editor
- ✅ Live robot feedback
- ✅ AI feedback panel
- ✅ Code submission flow

**Data Fetching:**
```typescript
const { data: levels } = trpc.world.getLevels.useQuery({ worldId });
const { data: challenges } = trpc.level.getChallenges.useQuery({ levelId });
const submitCode = trpc.submission.submit.useMutation();
```

**Layout:**
```
┌─────────────────────────────────────┐
│         Progress Header             │
├─────────────┬───────────────────────┤
│             │                       │
│  Challenge  │   Robot Sandbox      │
│  Description│                       │
│             ├───────────────────────┤
├─────────────┤   Feedback Panel     │
│             │                       │
│  Code       │                       │
│  Editor     │                       │
│             │                       │
└─────────────┴───────────────────────┘
```

**Flow:**
1. User reads challenge
2. User writes code in editor
3. User clicks "Run Code" → Robot executes and shows output
4. User clicks "Submit" → Server validates → AI feedback
5. On success → Navigate back to world

---

## Component Communication

### Event Flow

```
Editor (Run) → RobotSandbox
  ↓
  Sets sandboxCode prop
  ↓
  Robot executes code
  ↓
  Robot animates (success/error)
  ↓
  Shows console output

Editor (Submit) → API (submission.submit)
  ↓
  Server runs tests
  ↓
  Server calls AI feedback (if failed)
  ↓
  Returns result
  ↓
  FeedbackPanel displays
```

### State Management

**Local State (useState):**
- `code` - Current code in editor
- `sandboxCode` - Code to execute (triggers robot)
- `selectedChallengeId` - Active challenge (multi-challenge support)

**Server State (tRPC):**
- `trpc.user.getProfile` - User data
- `trpc.submission.getProgress` - Progress data
- `trpc.world.list` - All worlds
- `trpc.world.getLevels` - Levels in world
- `trpc.level.getChallenges` - Challenges in level
- `trpc.submission.submit` - Submit code mutation

**Optimistic Updates:**
- Profile invalidated on submission success
- Progress invalidated on XP change
- World list refetched after completion

---

## Styling

All components use:
- **TailwindCSS** for utility classes
- **Framer Motion** for animations
- **Lucide React** for icons
- **Gradient backgrounds** for depth
- **Shadow and borders** for elevation

**Color Palette:**
- Primary: Blue (500-600)
- Secondary: Purple (500-600)
- Success: Green (500-600)
- Error: Red (400-600)
- Warning: Orange (400-600)
- Info: Blue (400-600)

**Animations:**
- Entrance: Fade + Slide
- Hover: Scale + Shadow
- Tap: Scale down
- Loading: Spin
- Progress: Width transition

---

## Accessibility

All components implement:
- ✅ Semantic HTML
- ✅ ARIA labels where needed
- ✅ Keyboard navigation
- ✅ Focus states
- ✅ Screen reader friendly
- ✅ Color contrast compliance

---

## Component Checklist

- [x] Layout - Page scaffold with header & nav
- [x] WorldCard - Visual world representation
- [x] LevelCard - Level with lock status
- [x] Editor - Monaco with block support
- [x] RobotSandbox - Character visualization
- [x] FeedbackPanel - AI feedback display
- [x] ProgressHeader - XP, badges, streak
- [x] WorldMapPage - Worlds listing page
- [x] LevelPage - Challenge page

**All components match the architectural specification!** ✅


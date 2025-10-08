/**
 * Application-wide constants and configuration
 */

// XP and Progression
export const XP_PER_LEVEL = 500;
export const XP_FOR_HINT = -20; // Penalty for using hints
export const XP_BONUS_FIRST_TRY = 50;

// Level progression
export const LEVELS_TO_UNLOCK_WORLD = 3; // Complete 3 levels to unlock next world

// Robot animations
export const ROBOT_ANIMATIONS = {
  IDLE: "idle",
  THINKING: "thinking",
  SUCCESS: "success",
  ERROR: "error",
  CELEBRATE: "celebrate",
} as const;

// Editor settings
export const EDITOR_THEME = "vs-dark";
export const EDITOR_LANGUAGE = "javascript";
export const EDITOR_DEFAULT_CODE = "// Write your code here\nfunction main(input) {\n  \n}";

// AI Feedback settings
export const MAX_FEEDBACK_LENGTH = 500;
export const FEEDBACK_TEMPERATURE = 0.7;

// Badge requirements
export const BADGE_REQUIREMENTS = {
  FIRST_STEPS: "complete_1_level",
  GETTING_STARTED: "complete_5_levels",
  MAKING_PROGRESS: "complete_10_levels",
  WORLD_MASTER: "complete_world",
  SPEED_DEMON: "complete_level_under_5_min",
  PERFECTIONIST: "complete_level_first_try",
  XP_HUNTER_100: "earn_100_xp",
  XP_HUNTER_500: "earn_500_xp",
  XP_HUNTER_1000: "earn_1000_xp",
} as const;

// World colors (for UI theming)
export const WORLD_COLORS = {
  if_forest: "from-green-400 to-emerald-600",
  loop_lagoon: "from-blue-400 to-cyan-600",
  function_factory: "from-purple-400 to-pink-600",
  array_archipelago: "from-orange-400 to-red-600",
  object_oasis: "from-yellow-400 to-amber-600",
} as const;

// World icons (emoji or icon names)
export const WORLD_ICONS = {
  if_forest: "🌲",
  loop_lagoon: "🌊",
  function_factory: "⚙️",
  array_archipelago: "🏝️",
  object_oasis: "🏜️",
} as const;


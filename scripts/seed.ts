/**
 * Seeds worlds, levels, challenges (beginner fields included).
 */
import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";
require("dotenv").config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

function loadJSON(file: string) {
  const p = path.join(process.cwd(), "content", file);
  return JSON.parse(fs.readFileSync(p, "utf-8"));
}

async function seedWorlds() {
  const worlds = loadJSON("worlds.json");
  const payload = worlds.map((w: any) => ({
    id: w.id, name: w.name, description: w.description, order: w.order
  }));
  const { error } = await supabase.from("worlds").upsert(payload, { onConflict: "id" });
  if (error) throw error;
  console.log(`✅ Seeded ${payload.length} worlds`);
}

async function seedLevels() {
  const levels = loadJSON("levels.json");
  const payload = levels.map((l: any) => ({
    id: l.id, world_id: l.worldId, name: l.name, description: l.description, level_number: l.levelNumber
  }));
  const { error } = await supabase.from("levels").upsert(payload, { onConflict: "id" });
  if (error) throw error;
  console.log(`✅ Seeded ${payload.length} levels`);
}

async function seedChallenges() {
  console.log("🎯 Seeding challenges...");
  const challenges = loadJSON("challenges.json");
  const payload = challenges.map((c: any) => ({
    id: c.id,
    level_id: c.levelId,
    title: c.title,
    prompt: c.prompt,
    block_definition: c.blockDefinition ?? null,
    test_cases: c.testCases,
    starter_code: c.starterCode ?? null,   // <<< nieuw
    steps: c.steps ?? null                  // <<< nieuw
  }));
  const { error } = await supabase.from("challenges").upsert(payload, { onConflict: "id" });
  if (error) throw error;
  console.log(`✅ Seeded ${payload.length} challenges`);
}

async function seedBadges() {
  console.log("🏆 Seeding badges...");

  const badges = [
    {
      id: "850e8400-e29b-41d4-a716-446655440001",
      name: "First Steps",
      description: "Complete your first challenge",
      icon_url: "https://img.icons8.com/emoji/96/party-popper.png",
    },
    {
      id: "850e8400-e29b-41d4-a716-446655440002",
      name: "Getting Started",
      description: "Complete 5 challenges",
      icon_url: "https://img.icons8.com/emoji/96/star.png",
    },
    {
      id: "850e8400-e29b-41d4-a716-446655440003",
      name: "Making Progress",
      description: "Complete 10 challenges",
      icon_url: "https://img.icons8.com/emoji/96/glowing-star.png",
    },
    {
      id: "850e8400-e29b-41d4-a716-446655440004",
      name: "World Explorer",
      description: "Complete all challenges in a world",
      icon_url: "https://img.icons8.com/emoji/96/crown.png",
    },
    {
      id: "850e8400-e29b-41d4-a716-446655440005",
      name: "Perfectionist",
      description: "Complete a challenge on the first try",
      icon_url: "https://img.icons8.com/emoji/96/gem-stone.png",
    },
    {
      id: "850e8400-e29b-41d4-a716-446655440006",
      name: "XP Hunter",
      description: "Earn 500 XP",
      icon_url: "https://img.icons8.com/emoji/96/military-medal.png",
    },
    {
      id: "850e8400-e29b-41d4-a716-446655440007",
      name: "XP Master",
      description: "Earn 1000 XP",
      icon_url: "https://img.icons8.com/emoji/96/sports-medal.png",
    },
  ];

  const { error } = await supabase.from("badges").upsert(badges, {
    onConflict: "id",
  });

  if (error) throw error;
  console.log(`✅ Seeded ${badges.length} badges`);
}

async function main() {
  console.log("🚀 Starting database seeding...\n");

  try {
    // Seed in order due to foreign key constraints
    await seedWorlds();
    await seedLevels();
    await seedChallenges();
    await seedBadges();

    console.log("\n✨ Database seeding completed successfully!");
    console.log("\nSeeded data:");
    console.log("  • 5 worlds");
    console.log("  • 10 levels");
    console.log("  • 10 challenges");
    console.log("  • 7 badges");
  } catch (error) {
    console.error("\n❌ Seeding failed:", error);
    process.exit(1);
  }
}
main().catch(err => { console.error(err); process.exit(1); });
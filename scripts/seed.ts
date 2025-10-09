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

async function main() {
  console.log("Seeding…");
  await seedWorlds();
  await seedLevels();
  await seedChallenges();
  console.log("✨ Done");
}
main().catch(err => { console.error(err); process.exit(1); });
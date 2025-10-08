// TEMPORARY: Using mock database for initial Vercel deployment
// This will be replaced with real Supabase once connected via Vercel
export * from "./mock";

// ============================================================================
// PROFILES
// ============================================================================

export async function getProfileByUserId(userId: string): Promise<Profile | null> {
  const { data, error } = await supabaseAdmin
    .from("profiles")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null; // Not found
    throw error;
  }
  return data;
}

export async function createProfile(
  userId: string,
  displayName?: string
): Promise<Profile> {
  const { data, error } = await supabaseAdmin
    .from("profiles")
    .insert({
      user_id: userId,
      display_name: displayName || null,
      xp: 0,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateProfile(
  userId: string,
  updates: { displayName?: string; avatarUrl?: string }
): Promise<Profile> {
  const { data, error } = await supabaseAdmin
    .from("profiles")
    .update({
      display_name: updates.displayName,
      avatar_url: updates.avatarUrl,
    })
    .eq("user_id", userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function incrementUserXP(userId: string, xpAmount: number): Promise<void> {
  const { error } = await supabaseAdmin.rpc("increment_user_xp", {
    p_user_id: userId,
    xp_amount: xpAmount,
  });

  if (error) throw error;
}

// ============================================================================
// WORLDS
// ============================================================================

export async function getAllWorlds(): Promise<World[]> {
  const { data, error } = await supabaseAdmin
    .from("worlds")
    .select("*")
    .order("order", { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function getWorldById(id: string): Promise<World | null> {
  const { data, error } = await supabaseAdmin
    .from("worlds")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }
  return data;
}

// ============================================================================
// LEVELS
// ============================================================================

export async function getLevelsByWorldId(worldId: string): Promise<Level[]> {
  const { data, error } = await supabaseAdmin
    .from("levels")
    .select("*")
    .eq("world_id", worldId)
    .order("level_number", { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function getLevelById(id: string): Promise<Level | null> {
  const { data, error } = await supabaseAdmin
    .from("levels")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }
  return data;
}

// ============================================================================
// CHALLENGES
// ============================================================================

export async function getChallengesByLevelId(levelId: string): Promise<Challenge[]> {
  const { data, error } = await supabaseAdmin
    .from("challenges")
    .select("*")
    .eq("level_id", levelId);

  if (error) throw error;
  return data || [];
}

export async function getChallengeById(id: string): Promise<Challenge | null> {
  const { data, error } = await supabaseAdmin
    .from("challenges")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }
  return data;
}

// ============================================================================
// SUBMISSIONS
// ============================================================================

export async function createSubmission(
  userId: string,
  challengeId: string,
  code: string,
  status: SubmissionStatus
): Promise<Submission> {
  const { data, error } = await supabaseAdmin
    .from("submissions")
    .insert({
      user_id: userId,
      challenge_id: challengeId,
      code,
      status,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateSubmissionStatus(
  submissionId: string,
  status: SubmissionStatus
): Promise<Submission> {
  const { data, error } = await supabaseAdmin
    .from("submissions")
    .update({ status })
    .eq("id", submissionId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getSubmissionsByUserId(userId: string): Promise<Submission[]> {
  const { data, error } = await supabaseAdmin
    .from("submissions")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

// ============================================================================
// PROGRESS
// ============================================================================

export async function getUserProgress(userId: string): Promise<Progress[]> {
  const { data, error } = await supabaseAdmin
    .from("progress")
    .select("*")
    .eq("user_id", userId);

  if (error) throw error;
  return data || [];
}

export async function getChallengeProgress(
  userId: string,
  challengeId: string
): Promise<Progress | null> {
  const { data, error } = await supabaseAdmin
    .from("progress")
    .select("*")
    .eq("user_id", userId)
    .eq("challenge_id", challengeId)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }
  return data;
}

export async function updateProgress(
  userId: string,
  levelId: string,
  challengeId: string,
  status: ProgressStatus,
  score?: number
): Promise<Progress> {
  const { data, error } = await supabaseAdmin
    .from("progress")
    .upsert({
      user_id: userId,
      level_id: levelId,
      challenge_id: challengeId,
      status,
      score: score || 0,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ============================================================================
// BADGES
// ============================================================================

export async function getAllBadges(): Promise<Badge[]> {
  const { data, error } = await supabaseAdmin
    .from("badges")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function getUserBadges(userId: string): Promise<
  Array<Badge & { awardedAt: Date }>
> {
  const { data, error } = await supabaseAdmin
    .from("user_badges")
    .select(
      `
      awarded_at,
      badges:badge_id (
        id,
        name,
        description,
        icon_url,
        created_at
      )
    `
    )
    .eq("user_id", userId);

  if (error) throw error;

  // Flatten the response
  return (
    data?.map((item: any) => ({
      ...item.badges,
      awardedAt: item.awarded_at,
    })) || []
  );
}

export async function awardBadge(userId: string, badgeId: string): Promise<void> {
  const { error } = await supabaseAdmin.from("user_badges").insert({
    user_id: userId,
    badge_id: badgeId,
  });

  // Ignore duplicate key errors (badge already awarded)
  if (error && error.code !== "23505") {
    throw error;
  }
}

// ============================================================================
// AI FEEDBACK LOGS
// ============================================================================

export async function createAIFeedbackLog(
  submissionId: string,
  userId: string,
  feedback: {
    message: string;
    hints?: string[];
    encouragement?: string;
  }
): Promise<AIFeedbackLog> {
  const { data, error } = await supabaseAdmin
    .from("ai_feedback_logs")
    .insert({
      submission_id: submissionId,
      user_id: userId,
      feedback,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getAIFeedbackLogsForSubmission(
  submissionId: string
): Promise<AIFeedbackLog[]> {
  const { data, error } = await supabaseAdmin
    .from("ai_feedback_logs")
    .select("*")
    .eq("submission_id", submissionId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

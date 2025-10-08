// Real Supabase database connection
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Database helper functions
export async function getWorlds() {
  const { data, error } = await supabase
    .from('worlds')
    .select('*')
    .order('order');
  
  if (error) throw error;
  return data;
}

export async function getLevels(worldId: string) {
  const { data, error } = await supabase
    .from('levels')
    .select('*')
    .eq('world_id', worldId)
    .order('level_number');
  
  if (error) throw error;
  return data;
}

export async function getChallenges(levelId: string) {
  const { data, error } = await supabase
    .from('challenges')
    .select('*')
    .eq('level_id', levelId);
  
  if (error) throw error;
  return data;
}

export async function createSubmission(data: {
  challenge_id: string;
  user_id: string;
  code: string;
  status: 'pending' | 'pass' | 'fail';
}) {
  const { data: result, error } = await supabase
    .from('submissions')
    .insert(data)
    .select()
    .single();
  
  if (error) throw error;
  return result;
}

export async function getProgress(userId: string) {
  const { data, error } = await supabase
    .from('progress')
    .select('*')
    .eq('user_id', userId);
  
  if (error) throw error;
  return data;
}

export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  if (error) throw error;
  return data;
}

// Additional functions needed by routers
export async function getAllWorlds() {
  return getWorlds();
}

export async function getWorldById(worldId: string) {
  const { data, error } = await supabase
    .from('worlds')
    .select('*')
    .eq('id', worldId)
    .single();
  
  if (error) throw error;
  return data;
}

export async function getLevelsByWorldId(worldId: string) {
  return getLevels(worldId);
}

export async function getChallengesByLevelId(levelId: string) {
  return getChallenges(levelId);
}

export async function getChallengeById(challengeId: string) {
  const { data, error } = await supabase
    .from('challenges')
    .select('*')
    .eq('id', challengeId)
    .single();
  
  if (error) throw error;
  return data;
}

export async function updateSubmissionStatus(submissionId: string, status: 'pending' | 'pass' | 'fail') {
  const { data, error } = await supabase
    .from('submissions')
    .update({ status })
    .eq('id', submissionId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function getChallengeProgress(userId: string, challengeId: string) {
  const { data, error } = await supabase
    .from('progress')
    .select('*')
    .eq('user_id', userId)
    .eq('challenge_id', challengeId)
    .single();
  
  if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
  return data;
}

export async function incrementUserXP(userId: string, xpAmount: number) {
  // First get current XP
  const { data: currentProfile, error: fetchError } = await supabase
    .from('profiles')
    .select('xp')
    .eq('user_id', userId)
    .single();
  
  if (fetchError) throw fetchError;
  
  // Update with new XP
  const { data, error } = await supabase
    .from('profiles')
    .update({ xp: (currentProfile.xp || 0) + xpAmount })
    .eq('user_id', userId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function updateProgress(data: {
  user_id: string;
  level_id: string;
  challenge_id: string;
  status: 'locked' | 'unlocked' | 'completed';
  score?: number;
}) {
  const { data: result, error } = await supabase
    .from('progress')
    .upsert(data, { onConflict: 'user_id,challenge_id' })
    .select()
    .single();
  
  if (error) throw error;
  return result;
}

export async function createAIFeedbackLog(data: {
  submission_id: string;
  user_id: string;
  feedback: any;
}) {
  const { data: result, error } = await supabase
    .from('ai_feedback_logs')
    .insert(data)
    .select()
    .single();
  
  if (error) throw error;
  return result;
}

export async function getProfileByUserId(userId: string) {
  return getProfile(userId);
}

export async function getUserProgress(userId: string) {
  return getProgress(userId);
}

export async function getUserBadges(userId: string) {
  const { data, error } = await supabase
    .from('user_badges')
    .select(`
      *,
      badges (*)
    `)
    .eq('user_id', userId);
  
  if (error) throw error;
  return data;
}

export async function updateProfile(userId: string, data: {
  displayName?: string;
  avatarUrl?: string;
}) {
  const { data: result, error } = await supabase
    .from('profiles')
    .update(data)
    .eq('user_id', userId)
    .select()
    .single();
  
  if (error) throw error;
  return result;
}
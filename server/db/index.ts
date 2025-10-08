// Real Supabase database connection
import { createClient } from '@supabase/supabase-js';
import { Database } from '../../types/db';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);

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
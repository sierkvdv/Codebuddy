import { createClient } from "@supabase/supabase-js";

// TEMPORARY: Mock Supabase for initial Vercel deployment
// This will be replaced with real Supabase once connected via Vercel

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://mock.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "mock-anon-key";

// Client-side Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side Supabase client with service role (admin access)
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);


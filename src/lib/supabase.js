import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey =
  process.env.REACT_APP_SUPABASE_PUBLISHABLE_KEY || process.env.REACT_APP_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    })
  : null;

export const missingSupabaseEnv = [
  !supabaseUrl ? 'REACT_APP_SUPABASE_URL' : null,
  !supabaseKey
    ? 'REACT_APP_SUPABASE_PUBLISHABLE_KEY (or REACT_APP_SUPABASE_ANON_KEY)'
    : null,
].filter(Boolean);

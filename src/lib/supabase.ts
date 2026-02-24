import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? '';

// Use your Supabase project URL and anon key from env; fallback only when missing (e.g. landing page)
let supabase: SupabaseClient;
if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
  supabase = createClient('https://placeholder.supabase.co', 'placeholder');
}

export { supabase };

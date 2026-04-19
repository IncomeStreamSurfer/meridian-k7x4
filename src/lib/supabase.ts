import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.PUBLIC_SUPABASE_URL;
const anon = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

if (!url || !anon) {
  // Don't throw at import time — log so builds don't crash locally without env
  console.warn('[supabase] Missing PUBLIC_SUPABASE_URL or PUBLIC_SUPABASE_ANON_KEY');
}

export const supabase = createClient(url ?? '', anon ?? '', {
  auth: { persistSession: false, autoRefreshToken: false },
});

export type WaitlistRow = {
  id: string;
  email: string;
  source: string | null;
  created_at: string;
};

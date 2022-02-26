import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseClient: SupabaseClient;

declare module global {
  let __db: SupabaseClient | undefined;
}

const generateSupabaseClient = () =>
  createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);

if (process.env.NODE_ENV === 'production') {
  supabaseClient = generateSupabaseClient();
} else {
  if (!global.__db) {
    global.__db = generateSupabaseClient();
  }

  supabaseClient = global.__db;
}

export { supabaseClient };

// src/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr';
import { Database } from '@/supabase/types';

// Create a singleton instance for browser usage
export const supabase = createBrowserClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

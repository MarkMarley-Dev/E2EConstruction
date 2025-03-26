// app/lib/supabase/server.ts
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '../../types/supabase';

// Server component version - only import this in server components!
export const createServerSupabaseClient = () => {
  return createServerComponentClient<Database>({ cookies });
};
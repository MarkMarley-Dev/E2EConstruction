

// app/lib/supabase/actions.ts (new file for Server Actions)
'use server';

import { cookies } from 'next/headers';
import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '../../types/supabase';
import { revalidatePath } from 'next/cache';

// Server action client - use this in server actions
export const createActionSupabaseClient = () => {
  return createServerActionClient<Database>({ cookies });
};

// Example server action for authentication
export async function signIn(formData: FormData) {
  const supabase = createActionSupabaseClient();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) {
    return { error: error.message };
  }
  
  revalidatePath('/');
  return { success: true };
}

// Example server action for data fetching
export async function fetchUserProperties(userId: string) {
  const supabase = createActionSupabaseClient();
  
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('user_id', userId);
    
  if (error) {
    return { error: error.message };
  }
  
  return { data };
}
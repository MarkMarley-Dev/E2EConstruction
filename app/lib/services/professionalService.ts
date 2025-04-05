import { supabase } from '@/lib/supabase/client';

// Types for professionals
export interface Professional {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  company_name: string | null;
  profile_image_url: string | null;
  specializations: string[] | null;
  years_experience: number | null;
  bio: string | null;
  city: string | null;
  postcode: string | null;
  rating: number | null;
  review_count: number | null;
  verified: boolean;
}

interface SearchProfessionalsParams {
  projectType?: string;
  location?: string;
  specializations?: string[];
  maxResults?: number;
}

export async function searchProfessionals({ 
  projectType = '', 
  location = '',
  maxResults = 10
} = {}) {
  let query = supabase
    .from('profiles')
    .select('*')
    .in('role', ['architect', 'surveyor', 'contractor', 'planner'])
    .eq('verified', true)
    .limit(maxResults);
  
  // If project type is provided, filter by specializations
  if (projectType) {
    query = query.contains('specializations', [projectType]);
  }
  
  // Simple location filter (would be more sophisticated in production)
  if (location) {
    query = query.or(`city.ilike.%${location}%,postcode.ilike.%${location}%`);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error searching professionals:', error);
    return [];
  }
  
  return data || [];
}

export async function getProfessionalById(id: string): Promise<Professional | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error('Error getting professional:', error);
    return null;
  }
  
  return data as Professional;
}
export async function getProjectById(id: string) {
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      property:property_id (*)
    `)
    .eq('id', id)
    .single();
  
  if (error) {
    console.error('Error getting project:', error);
    throw error;
  }
  
  return data;
}
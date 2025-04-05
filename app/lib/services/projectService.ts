// app/lib/services/projectService.ts

import { supabase } from '@/lib/supabase/client';
import { Project, ProjectInsert, ProjectUpdate, PropertyInsert } from '@/types/supabase';

// Create a project with a simplified property creation flow
export async function createQuickProject(
  projectData: {
    title: string;
    project_type: string;
    description?: string;
    budget_range?: string;
    timeline?: string;
    property: {
      address_line1: string;
      address_line2?: string;
      city: string;
      postal_code: string;
      property_type: 'residential' | 'commercial' | 'mixed_use' | 'land';
      country?: string;
    }
  }
): Promise<string> {
  // Get user from auth context
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('You must be logged in to create a project');
  }
  
  // Begin a transaction by starting a block
  const { data: propertyData, error: propertyError } = await supabase
    .from('properties')
    .insert({
      user_id: user.id,
      address_line1: projectData.property.address_line1,
      address_line2: projectData.property.address_line2 || null,
      city: projectData.property.city,
      postal_code: projectData.property.postal_code,
      property_type: projectData.property.property_type,
      country: projectData.property.country || 'United Kingdom',
      conservation_area: false, // Default, can be updated later
      listed_building: false, // Default, can be updated later
      is_active: true
    } as PropertyInsert)
    .select('id')
    .single();
  
  if (propertyError) {
    throw propertyError;
  }
  
  // Create the project linked to the new property
  const { data: project, error: projectError } = await supabase
    .from('projects')
    .insert({
      property_id: propertyData.id,
      user_id: user.id,
      title: projectData.title,
      project_type: projectData.project_type,
      description: projectData.description || null,
      budget_range: projectData.budget_range || null,
      timeline: projectData.timeline || null,
      status: 'new',
      is_active: true
    } as ProjectInsert)
    .select('id')
    .single();
  
  if (projectError) {
    throw projectError;
  }
  
  return project.id;
}

// Get project by ID with related data
export async function getProjectById(id: string): Promise<Project & { property: any, professionals: any[] }> {
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      property:property_id (*),
      professionals:project_professionals (
        *,
        professional_profile:professional_id (*)
      )
    `)
    .eq('id', id)
    .single();
  
  if (error) {
    throw error;
  }
  
  return data;
}

// Get all projects for the current user
export async function getUserProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      property:property_id (
        address_line1,
        address_line2,
        city,
        postal_code
      )
    `)
    .order('created_at', { ascending: false });
  
  if (error) {
    throw error;
  }
  
  return data;
}

// Update project status
export async function updateProjectStatus(id: string, status: string): Promise<void> {
  const { error } = await supabase
    .from('projects')
    .update({ status, updated_at: new Date().toISOString() } as ProjectUpdate)
    .eq('id', id);
  
  if (error) {
    throw error;
  }
}

// Invite a professional to a project
export async function inviteProfessionalToProject(
  projectId: string, 
  professionalId: string,
  role: string
): Promise<void> {
  const { error } = await supabase
    .from('project_professionals')
    .insert({
      project_id: projectId,
      professional_id: professionalId,
      role,
      status: 'invited'
    });
  
  if (error) {
    throw error;
  }
}


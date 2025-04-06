// app/types/supabase.ts
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      properties: {
        Row: {
          id: string
          user_id: string
          created_at: string
          updated_at: string
          property_name: string | null
          property_type: 'residential' | 'commercial' | 'mixed_use' | 'land'
          address_line1: string
          address_line2: string | null
          city: string
          county: string | null
          postal_code: string
          country: string
          latitude: number | null
          longitude: number | null
          year_built: number | null
          floor_area_sqm: number | null
          land_area_sqm: number | null
          num_bedrooms: number | null
          num_bathrooms: number | null
          planning_authority: string | null
          conservation_area: boolean
          listed_building: boolean
          listed_building_grade: string | null
          description: string | null
          is_active: boolean
        }
        Insert: {
          id?: string
          user_id: string
          created_at?: string
          updated_at?: string
          property_name?: string | null
          property_type: 'residential' | 'commercial' | 'mixed_use' | 'land'
          address_line1: string
          address_line2?: string | null
          city: string
          county?: string | null
          postal_code: string
          country?: string
          latitude?: number | null
          longitude?: number | null
          year_built?: number | null
          floor_area_sqm?: number | null
          land_area_sqm?: number | null
          num_bedrooms?: number | null
          num_bathrooms?: number | null
          planning_authority?: string | null
          conservation_area?: boolean
          listed_building?: boolean
          listed_building_grade?: string | null
          description?: string | null
          is_active?: boolean
        }
        Update: {
          id?: string
          user_id?: string
          created_at?: string
          updated_at?: string
          property_name?: string | null
          property_type?: 'residential' | 'commercial' | 'mixed_use' | 'land'
          address_line1?: string
          address_line2?: string | null
          city?: string
          county?: string | null
          postal_code?: string
          country?: string
          latitude?: number | null
          longitude?: number | null
          year_built?: number | null
          floor_area_sqm?: number | null
          land_area_sqm?: number | null
          num_bedrooms?: number | null
          num_bathrooms?: number | null
          planning_authority?: string | null
          conservation_area?: boolean
          listed_building?: boolean
          listed_building_grade?: string | null
          description?: string | null
          is_active?: boolean
        }
      }
      property_images: {
        Row: {
          id: string
          property_id: string
          created_at: string
          storage_path: string
          file_name: string
          file_type: string
          file_size: number
          is_primary: boolean
          description: string | null
          url: string | null
        }
        Insert: {
          id?: string
          property_id: string
          created_at?: string
          storage_path: string
          file_name: string
          file_type: string
          file_size: number
          is_primary?: boolean
          description?: string | null
        }
        Update: {
          id?: string
          property_id?: string
          created_at?: string
          storage_path?: string
          file_name?: string
          file_type?: string
          file_size?: number
          is_primary?: boolean
          description?: string | null
        }
      }
      property_documents: {
        Row: {
          id: string
          property_id: string
          created_at: string
          document_type: string
          storage_path: string
          file_name: string
          file_type: string
          file_size: number
          description: string | null
        }
        Insert: {
          id?: string
          property_id: string
          created_at?: string
          document_type: string
          storage_path: string
          file_name: string
          file_type: string
          file_size: number
          description?: string | null
        }
        Update: {
          id?: string
          property_id?: string
          created_at?: string
          document_type?: string
          storage_path?: string
          file_name?: string
          file_type?: string
          file_size?: number
          description?: string | null
        }
      }
      projects: {
        Row: {
          id: string
          property_id: string
          user_id: string
          created_at: string
          updated_at: string
          title: string
          project_type: string
          description: string | null
          budget_range: string | null
          timeline: string | null
          status: string
          is_active: boolean
        }
        Insert: {
          id?: string
          property_id: string
          user_id: string
          created_at?: string
          updated_at?: string
          title: string
          project_type: string
          description?: string | null
          budget_range?: string | null
          timeline?: string | null
          status?: string
          is_active?: boolean
        }
        Update: {
          id?: string
          property_id?: string
          user_id?: string
          created_at?: string
          updated_at?: string
          title?: string
          project_type?: string
          description?: string | null
          budget_range?: string | null
          timeline?: string | null
          status?: string
          is_active?: boolean
        }
      }
      
      project_professionals: {
        Row: {
          id: string
          project_id: string
          professional_id: string
          created_at: string
          status: string
          role: string
          last_message_at: string | null
        }
        Insert: {
          id?: string
          project_id: string
          professional_id: string
          created_at?: string
          status?: string
          role: string
          last_message_at?: string | null
        }
        Update: {
          id?: string
          project_id?: string
          professional_id?: string
          created_at?: string
          status?: string
          role?: string
          last_message_at?: string | null
        }
      }
      
      planning_assessments: {
        Row: {
          id: string
          project_id: string
          professional_id: string
          created_at: string
          updated_at: string
          requires_permission: boolean | null
          permission_types: string[] | null
          timeframe: string | null
          estimated_cost_range: string | null
          notes: string | null
          status: string
        }
        Insert: {
          id?: string
          project_id: string
          professional_id: string
          created_at?: string
          updated_at?: string
          requires_permission?: boolean | null
          permission_types?: string[] | null
          timeframe?: string | null
          estimated_cost_range?: string | null
          notes?: string | null
          status?: string
        }
        Update: {
          id?: string
          project_id?: string
          professional_id?: string
          created_at?: string
          updated_at?: string
          requires_permission?: boolean | null
          permission_types?: string[] | null
          timeframe?: string | null
          estimated_cost_range?: string | null
          notes?: string | null
          status?: string
        }
      }
      
      profiles: {
        Row: {
          id: string
          first_name: string | null
          last_name: string | null
          email: string | null
          phone: string | null
          role: string | null
          company_name: string | null
          created_at: string | null
          updated_at: string | null
          specializations: string[] | null
          years_experience: number | null
          bio: string | null
          city: string | null
          postcode: string | null
          verified: boolean | null
          profile_image_url: string | null
        }
        Insert: {
          id: string
          first_name?: string | null
          last_name?: string | null
          email?: string | null
          phone?: string | null
          role?: string | null
          company_name?: string | null
          created_at?: string | null
          updated_at?: string | null
          specializations?: string[] | null
          years_experience?: number | null
          bio?: string | null
          city?: string | null
          postcode?: string | null
          verified?: boolean | null
          profile_image_url?: string | null
        }
        Update: {
          id?: string
          first_name?: string | null
          last_name?: string | null
          email?: string | null
          phone?: string | null
          role?: string | null
          company_name?: string | null
          created_at?: string | null
          updated_at?: string | null
          specializations?: string[] | null
          years_experience?: number | null
          bio?: string | null
          city?: string | null
          postcode?: string | null
          verified?: boolean | null
          profile_image_url?: string | null
        }
      }
    }
  }
}

// Simplified types for common usage in components
export type Property = Database['public']['Tables']['properties']['Row'];
export type PropertyInsert = Database['public']['Tables']['properties']['Insert'];
export type PropertyUpdate = Database['public']['Tables']['properties']['Update'];

export type PropertyImage = Database['public']['Tables']['property_images']['Row'];
export type PropertyImageInsert = Database['public']['Tables']['property_images']['Insert'];

export type PropertyDocument = Database['public']['Tables']['property_documents']['Row'];
export type PropertyDocumentInsert = Database['public']['Tables']['property_documents']['Insert'];

// Project types
export type Project = Database['public']['Tables']['projects']['Row'];
export type ProjectInsert = Database['public']['Tables']['projects']['Insert'];
export type ProjectUpdate = Database['public']['Tables']['projects']['Update'];

export type ProjectProfessional = Database['public']['Tables']['project_professionals']['Row'];
export type ProjectProfessionalInsert = Database['public']['Tables']['project_professionals']['Insert'];

export type PlanningAssessment = Database['public']['Tables']['planning_assessments']['Row'];
export type PlanningAssessmentInsert = Database['public']['Tables']['planning_assessments']['Insert'];

// Profile types
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

// Helper interface for professional components
export interface Professional extends Profile {
  // Any additional fields or computed properties specific to professionals
}

// Extended project interface with related data for dashboard display
export interface ProjectWithRelations extends Project {
  properties?: {
    id: string;
    address_line1: string;
    address_line2?: string | null;
    city: string;
    postal_code: string;
  };
  project_professionals?: Array<{
    id: string;
    professional_id: string;
    role: string;
    status: string;
    profiles?: {
      id: string;
      first_name: string | null;
      last_name: string | null;
      role: string | null;
      company_name: string | null;
      verified: boolean | null;
    }
  }>;
}

// Function to map profile data to our component model
export function mapProfileToProfessional(profile: Profile): Professional {
  return {
    ...profile,
    // Add any default values or transformations needed
    verified: profile.verified || false
  };
}

// Project type constants for UI display
export const PROJECT_TYPES = {
  extension: 'Extension',
  renovation: 'Renovation',
  new_build: 'New Build',
  loft_conversion: 'Loft Conversion',
  basement: 'Basement',
  garage_conversion: 'Garage Conversion',
  interior_redesign: 'Interior Redesign',
  garden_landscaping: 'Garden/Landscaping',
  other: 'Other'
};

// Project status constants for UI display
export const PROJECT_STATUSES = {
  new: 'New',
  planning: 'Planning',
  design: 'Design',
  in_progress: 'In Progress',
  on_hold: 'On Hold',
  completed: 'Completed',
  cancelled: 'Cancelled'
};

// Budget range constants for UI display
export const BUDGET_RANGES = {
  under_10k: 'Under £10,000',
  '10k_25k': '£10,000 - £25,000',
  '25k_50k': '£25,000 - £50,000',
  '50k_100k': '£50,000 - £100,000',
  '100k_250k': '£100,000 - £250,000',
  '250k_500k': '£250,000 - £500,000',
  '500k_1m': '£500,000 - £1,000,000',
  above_1m: 'Above £1,000,000'
};

// Timeline constants for UI display
export const TIMELINES = {
  under_1_month: 'Under 1 month',
  '1_3_months': '1-3 months',
  '3_6_months': '3-6 months',
  '6_12_months': '6-12 months',
  above_12_months: 'Above 12 months'
};
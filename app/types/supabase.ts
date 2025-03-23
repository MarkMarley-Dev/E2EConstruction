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
      profiles: {
        Row: {
          id: string
          email: string
          first_name: string | null
          last_name: string | null
          phone: string | null
          role: 'property_owner' | 'contractor' | 'surveyor' | 'admin'
          company_name: string | null
          company_registration: string | null
          address: string | null
          city: string | null
          postcode: string | null
          country: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          role: 'property_owner' | 'contractor' | 'surveyor' | 'admin'
          company_name?: string | null
          company_registration?: string | null
          address?: string | null
          city?: string | null
          postcode?: string | null
          country?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          role?: 'property_owner' | 'contractor' | 'surveyor' | 'admin'
          company_name?: string | null
          company_registration?: string | null
          address?: string | null
          city?: string | null
          postcode?: string | null
          country?: string
          created_at?: string
          updated_at?: string
        }
      }
      properties: {
        Row: {
          id: string
          owner_id: string
          address: string
          address_line_2: string | null
          city: string
          county: string | null
          postcode: string
          property_type: 'detached' | 'semi_detached' | 'terraced' | 'flat' | 'commercial' | 'other'
          year_built: number | null
          floor_area_sqm: number | null
          location: unknown | null
          planning_authority: string | null
          conservation_area: boolean
          listed_building: boolean
          listed_building_grade: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          owner_id: string
          address: string
          address_line_2?: string | null
          city: string
          county?: string | null
          postcode: string
          property_type: 'detached' | 'semi_detached' | 'terraced' | 'flat' | 'commercial' | 'other'
          year_built?: number | null
          floor_area_sqm?: number | null
          location?: unknown | null
          planning_authority?: string | null
          conservation_area?: boolean
          listed_building?: boolean
          listed_building_grade?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          owner_id?: string
          address?: string
          address_line_2?: string | null
          city?: string
          county?: string | null
          postcode?: string
          property_type?: 'detached' | 'semi_detached' | 'terraced' | 'flat' | 'commercial' | 'other'
          year_built?: number | null
          floor_area_sqm?: number | null
          location?: unknown | null
          planning_authority?: string | null
          conservation_area?: boolean
          listed_building?: boolean
          listed_building_grade?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// app/types/auth.ts
export interface UserProfile {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  role: 'property_owner' | 'contractor' | 'surveyor' | 'admin';
  companyName: string | null;
  companyRegistration: string | null;
  address: string | null;
  city: string | null;
  postcode: string | null;
  country: string;
}

// app/types/property.ts
export interface Property {
  id: string;
  ownerId: string;
  address: string;
  addressLine2: string | null;
  city: string;
  county: string | null;
  postcode: string;
  propertyType: 'detached' | 'semi_detached' | 'terraced' | 'flat' | 'commercial' | 'other';
  yearBuilt: number | null;
  floorAreaSqm: number | null;
  location: any | null;
  planningAuthority: string | null;
  conservationArea: boolean;
  listedBuilding: boolean;
  listedBuildingGrade: string | null;
  createdAt: string;
  updatedAt: string;
}
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
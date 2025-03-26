// app/lib/services/propertyService.ts
import { supabase } from '@/lib/supabase/client';
import { createServerSupabaseClient } from '@/lib/supabase/client';
import { PropertyInsert, PropertyUpdate, Property } from '@/types/supabase';

// Client-side property service
export const propertyService = {
  /**
   * Get all properties for the current user
   */
  async getUserProperties(): Promise<{ data: Property[] | null; error: Error | null }> {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false });
    
    return { data, error };
  },

  /**
   * Get a single property by ID
   */
  async getPropertyById(id: string): Promise<{ data: Property | null; error: Error | null }> {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('id', id)
      .single();
    
    return { data, error };
  },

  /**
   * Create a new property
   */
  async createProperty(property: PropertyInsert): Promise<{ data: Property | null; error: Error | null }> {
    // Get the current user's ID
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { data: null, error: new Error('User not authenticated') };
    }

    // Add the user_id to the property data
    const propertyWithUserId = {
      ...property,
      user_id: user.id
    };

    const { data, error } = await supabase
      .from('properties')
      .insert(propertyWithUserId)
      .select()
      .single();
    
    return { data, error };
  },

  /**
   * Update an existing property
   */
  async updateProperty(id: string, updates: PropertyUpdate): Promise<{ data: Property | null; error: Error | null }> {
    const { data, error } = await supabase
      .from('properties')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    return { data, error };
  },

  /**
   * Delete a property
   */
  async deleteProperty(id: string): Promise<{ error: Error | null }> {
    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', id);
    
    return { error };
  },

  /**
   * Upload a property image
   */
  async uploadPropertyImage(
    propertyId: string, 
    file: File, 
    isPrimary: boolean = false
  ): Promise<{ data: { path: string } | null; error: Error | null }> {
    // Create a unique file path
    const filePath = `property_images/${propertyId}/${Date.now()}_${file.name}`;
    
    // Upload the file to Supabase Storage
    const { data, error } = await supabase.storage
      .from('properties')
      .upload(filePath, file);
      
    if (error) {
      return { data: null, error };
    }
    
    // Add record to property_images table
    const { error: dbError } = await supabase
      .from('property_images')
      .insert({
        property_id: propertyId,
        storage_path: filePath,
        file_name: file.name,
        file_type: file.type,
        file_size: file.size,
        is_primary: isPrimary
      });
    
    if (dbError) {
      // If database insert fails, attempt to delete the uploaded file
      await supabase.storage.from('properties').remove([filePath]);
      return { data: null, error: dbError };
    }
    
    return { data: { path: filePath }, error: null };
  },

  /**
   * Get property images
   */
  async getPropertyImages(propertyId: string) {
    const { data, error } = await supabase
      .from('property_images')
      .select('*')
      .eq('property_id', propertyId)
      .order('is_primary', { ascending: false })
      .order('created_at', { ascending: false });
    
    return { data, error };
  },

  /**
   * Set primary property image
   */
  async setPrimaryPropertyImage(propertyId: string, imageId: string) {
    try {
      // First, clear is_primary from all images for this property
      await supabase
        .from('property_images')
        .update({ is_primary: false })
        .eq('property_id', propertyId);
      
      // Then set the selected image as primary
      const { data, error } = await supabase
        .from('property_images')
        .update({ is_primary: true })
        .eq('id', imageId)
        .eq('property_id', propertyId)
        .select()
        .single();
      
      return { data, error };
    } catch (error) {
      console.error('Error setting primary property image:', error);
      return { data: null, error };
    }
  },

  /**
   * Delete property image
   */
  async deletePropertyImage(propertyId: string, imageId: string) {
    try {
      // First get the image details to know what to delete from storage
      const { data: imageData, error: fetchError } = await supabase
        .from('property_images')
        .select('storage_path')
        .eq('id', imageId)
        .eq('property_id', propertyId)
        .single();
      
      if (fetchError) {
        throw fetchError;
      }
      
      // Delete from storage if we have a storage path
      if (imageData?.storage_path) {
        const { error: storageError } = await supabase
          .storage
          .from('properties')
          .remove([imageData.storage_path]);
        
        if (storageError) {
          console.error('Error removing file from storage:', storageError);
          // Continue anyway to remove from database
        }
      }
      
      // Delete from database
      const { data, error } = await supabase
        .from('property_images')
        .delete()
        .eq('id', imageId)
        .eq('property_id', propertyId);
      
      return { data, error };
    } catch (error) {
      console.error('Error deleting property image:', error);
      return { data: null, error };
    }
  },

  /**
   * Upload a property document
   */
  async uploadPropertyDocument(
    propertyId: string, 
    file: File,
    documentType: string,
    description?: string
  ): Promise<{ data: { path: string } | null; error: Error | null }> {
    // Create a unique file path
    const filePath = `property_documents/${propertyId}/${Date.now()}_${file.name}`;
    
    // Upload the file to Supabase Storage
    const { data, error } = await supabase.storage
      .from('properties')
      .upload(filePath, file);
      
    if (error) {
      return { data: null, error };
    }
    
    // Add record to property_documents table
    const { error: dbError } = await supabase
      .from('property_documents')
      .insert({
        property_id: propertyId,
        document_type: documentType,
        storage_path: filePath,
        file_name: file.name,
        file_type: file.type,
        file_size: file.size,
        description
      });
    
    if (dbError) {
      // If database insert fails, attempt to delete the uploaded file
      await supabase.storage.from('properties').remove([filePath]);
      return { data: null, error: dbError };
    }
    
    return { data: { path: filePath }, error: null };
  },

  /**
   * Get property documents
   */
  async getPropertyDocuments(propertyId: string) {
    const { data, error } = await supabase
      .from('property_documents')
      .select('*')
      .eq('property_id', propertyId)
      .order('created_at', { ascending: false });
    
    return { data, error };
  }
};

// Server-side property service
export const serverPropertyService = {
  /**
   * Get all properties for a specific user from the server
   */
  async getUserProperties(userId: string): Promise<{ data: Property[] | null; error: Error | null }> {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    return { data, error };
  },

  /**
   * Get a single property by ID from the server
   */
  async getPropertyById(id: string): Promise<{ data: Property | null; error: Error | null }> {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('id', id)
      .single();
    
    return { data, error };
  },

  /**
   * Get property images from the server
   */
  async getPropertyImages(propertyId: string) {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from('property_images')
      .select('*')
      .eq('property_id', propertyId)
      .order('is_primary', { ascending: false });
    
    return { data, error };
  },

  /**
   * Get property documents from the server
   */
  async getPropertyDocuments(propertyId: string) {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from('property_documents')
      .select('*')
      .eq('property_id', propertyId)
      .order('created_at', { ascending: false });
    
    return { data, error };
  }
};
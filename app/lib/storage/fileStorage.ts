// lib/storage/fileStorage.ts
import { supabase } from '@/lib/supabase/client';
import { Database } from '@/types/supabase';
import { v4 as uuidv4 } from 'uuid';

// Storage buckets
export const STORAGE_BUCKETS = {
  PROPERTY_IMAGES: 'property-images',
  PROPERTY_DOCUMENTS: 'property-documents',
  PLANNING_DOCUMENTS: 'planning-documents',
  PARTY_WALL_DOCUMENTS: 'party-wall-documents',
};

// Allowed file types
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
export const ALLOWED_DOCUMENT_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

// Maximum file sizes
export const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10 MB
export const MAX_DOCUMENT_SIZE = 50 * 1024 * 1024; // 50 MB

/**
 * Generate a unique file path for upload
 */
export function generateFilePath(
  folder: string,
  fileName: string,
  propertyId: string,
  userId: string
) {
  const fileExt = fileName.split('.').pop() || '';
  return `${folder}/${propertyId}/${userId}_${uuidv4()}.${fileExt}`;
}

/**
 * Upload a file to Supabase storage
 */
export async function uploadFile(
  bucket: string,
  filePath: string,
  file: File,
  options = { cacheControl: '3600', upsert: true }
) {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, options);

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Get a public URL for a file
 */
export function getFileUrl(bucket: string, filePath: string) {
  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
  return data.publicUrl;
}

/**
 * Delete a file from storage
 */
export async function deleteFile(bucket: string, filePath: string) {
  const { error } = await supabase.storage.from(bucket).remove([filePath]);
  
  if (error) {
    throw error;
  }
  
  return true;
}

/**
 * Upload a property image
 */
export async function uploadPropertyImage(
  file: File,
  propertyId: string,
  userId: string,
  isPrimary = false
) {
  try {
    // Validate file type
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      throw new Error(`Invalid file type. Allowed types: ${ALLOWED_IMAGE_TYPES.join(', ')}`);
    }

    // Validate file size
    if (file.size > MAX_IMAGE_SIZE) {
      throw new Error(`File too large. Maximum size is ${MAX_IMAGE_SIZE / (1024 * 1024)}MB`);
    }

    // Generate file path
    const filePath = generateFilePath('images', file.name, propertyId, userId);
    
    // Upload to storage
    await uploadFile(STORAGE_BUCKETS.PROPERTY_IMAGES, filePath, file);
    
    // Get public URL
    const publicUrl = getFileUrl(STORAGE_BUCKETS.PROPERTY_IMAGES, filePath);
    
    // Create database entry
    const { data, error } = await supabase
      .from('property_images')
      .insert({
        property_id: propertyId,
        storage_path: filePath,
        file_name: file.name,
        file_type: file.type,
        file_size: file.size,
        is_primary: isPrimary,
        url: publicUrl
      })
      .select()
      .single();
      
    if (error) {
      // Cleanup storage if database insert fails
      await deleteFile(STORAGE_BUCKETS.PROPERTY_IMAGES, filePath);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error uploading property image:', error);
    throw error;
  }
}

/**
 * Upload a property document
 */
export async function uploadPropertyDocument(
  file: File,
  propertyId: string,
  userId: string,
  documentType: string,
  description?: string
) {
  try {
    // Validate file type
    if (!ALLOWED_DOCUMENT_TYPES.includes(file.type)) {
      throw new Error(`Invalid file type. Allowed types: ${ALLOWED_DOCUMENT_TYPES.join(', ')}`);
    }

    // Validate file size
    if (file.size > MAX_DOCUMENT_SIZE) {
      throw new Error(`File too large. Maximum size is ${MAX_DOCUMENT_SIZE / (1024 * 1024)}MB`);
    }

    // Generate file path
    const filePath = generateFilePath('documents', file.name, propertyId, userId);
    
    // Upload to storage
    await uploadFile(STORAGE_BUCKETS.PROPERTY_DOCUMENTS, filePath, file);
    
    // Create database entry
    const { data, error } = await supabase
      .from('property_documents')
      .insert({
        property_id: propertyId,
        document_type: documentType,
        storage_path: filePath,
        file_name: file.name,
        file_type: file.type,
        file_size: file.size,
        description: description || null
      })
      .select()
      .single();
      
    if (error) {
      // Cleanup storage if database insert fails
      await deleteFile(STORAGE_BUCKETS.PROPERTY_DOCUMENTS, filePath);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error uploading property document:', error);
    throw error;
  }
}

/**
 * Get all images for a property
 */
export async function getPropertyImages(propertyId: string) {
  try {
    const { data, error } = await supabase
      .from('property_images')
      .select('*')
      .eq('property_id', propertyId)
      .order('is_primary', { ascending: false });
      
    if (error) {
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching property images:', error);
    throw error;
  }
}

/**
 * Get all documents for a property
 */
export async function getPropertyDocuments(propertyId: string) {
  try {
    const { data, error } = await supabase
      .from('property_documents')
      .select('*')
      .eq('property_id', propertyId)
      .order('created_at', { ascending: false });
      
    if (error) {
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching property documents:', error);
    throw error;
  }
}

/**
 * Set a property image as primary
 */
export async function setPropertyImageAsPrimary(imageId: string, propertyId: string) {
  try {
    // Begin a transaction to ensure data consistency
    const { error: resetError } = await supabase
      .from('property_images')
      .update({ is_primary: false })
      .eq('property_id', propertyId);
      
    if (resetError) {
      throw resetError;
    }
    
    const { error: updateError } = await supabase
      .from('property_images')
      .update({ is_primary: true })
      .eq('id', imageId);
      
    if (updateError) {
      throw updateError;
    }
    
    return true;
  } catch (error) {
    console.error('Error setting primary image:', error);
    throw error;
  }
}

/**
 * Delete a property image
 */
export async function deletePropertyImage(imageId: string) {
  try {
    // First get the image details to get the storage path
    const { data, error: fetchError } = await supabase
      .from('property_images')
      .select('storage_path, is_primary, property_id')
      .eq('id', imageId)
      .single();
      
    if (fetchError) {
      throw fetchError;
    }
    
    if (!data) {
      throw new Error('Image not found');
    }
    
    // Delete from storage
    await deleteFile(STORAGE_BUCKETS.PROPERTY_IMAGES, data.storage_path);
    
    // Delete from database
    const { error: deleteError } = await supabase
      .from('property_images')
      .delete()
      .eq('id', imageId);
      
    if (deleteError) {
      throw deleteError;
    }
    
    // If this was the primary image, set another one as primary
    if (data.is_primary) {
      const { data: remainingImages, error: fetchImagesError } = await supabase
        .from('property_images')
        .select('id')
        .eq('property_id', data.property_id)
        .limit(1);
        
      if (fetchImagesError) {
        throw fetchImagesError;
      }
      
      if (remainingImages && remainingImages.length > 0) {
        await setPropertyImageAsPrimary(remainingImages[0].id, data.property_id);
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting property image:', error);
    throw error;
  }
}

/**
 * Delete a property document
 */
export async function deletePropertyDocument(documentId: string) {
  try {
    // First get the document details to get the storage path
    const { data, error: fetchError } = await supabase
      .from('property_documents')
      .select('storage_path')
      .eq('id', documentId)
      .single();
      
    if (fetchError) {
      throw fetchError;
    }
    
    if (!data) {
      throw new Error('Document not found');
    }
    
    // Delete from storage
    await deleteFile(STORAGE_BUCKETS.PROPERTY_DOCUMENTS, data.storage_path);
    
    // Delete from database
    const { error: deleteError } = await supabase
      .from('property_documents')
      .delete()
      .eq('id', documentId);
      
    if (deleteError) {
      throw deleteError;
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting property document:', error);
    throw error;
  }
}
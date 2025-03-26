'use client';

import { useState, useRef } from 'react';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { UploadCloud, X, AlertCircle } from 'lucide-react';
import styles from '@/styles/FileUpload.module.css';
import { 
  uploadPropertyImage,
  uploadPropertyDocument,
  ALLOWED_IMAGE_TYPES,
  ALLOWED_DOCUMENT_TYPES,
  MAX_IMAGE_SIZE,
  MAX_DOCUMENT_SIZE
} from '@/lib/storage/fileStorage';

type FileUploadProps = {
  propertyId: string;
  uploadType: 'image' | 'document';
  documentType?: string;
  onUploadComplete: (data: any) => void;
};

export default function FileUpload({ 
  propertyId, 
  uploadType, 
  documentType = 'general',
  onUploadComplete 
}: FileUploadProps) {
  const supabaseClient = useSupabaseClient();
  const user = useUser();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const allowedTypes = uploadType === 'image' ? ALLOWED_IMAGE_TYPES : ALLOWED_DOCUMENT_TYPES;
  const maxSize = uploadType === 'image' ? MAX_IMAGE_SIZE : MAX_DOCUMENT_SIZE;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(null);
      return;
    }
    
    const file = e.target.files[0];
    
    // Validate file type
    if (!allowedTypes.includes(file.type)) {
      setError(`Invalid file type. Allowed types: ${allowedTypes.join(', ')}`);
      setSelectedFile(null);
      return;
    }
    
    // Validate file size
    if (file.size > maxSize) {
      setError(`File too large. Maximum size is ${maxSize / (1024 * 1024)}MB`);
      setSelectedFile(null);
      return;
    }
    
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile || !user) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    setError(null);
    
    try {
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const next = prev + 10;
          return next < 90 ? next : prev;
        });
      }, 300);
      
      // Upload file based on type
      let uploadResult;
      
      if (uploadType === 'image') {
        // Determine if this should be the primary image
        const { data: existingImages } = await supabaseClient
          .from('property_images')
          .select('id')
          .eq('property_id', propertyId);
          
        const isPrimary = !existingImages || existingImages.length === 0;
        
        uploadResult = await uploadPropertyImage(
          selectedFile,
          propertyId,
          user.id,
          isPrimary
        );
      } else {
        uploadResult = await uploadPropertyDocument(
          selectedFile,
          propertyId,
          user.id,
          documentType
        );
      }
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      // Notify parent of successful upload
      onUploadComplete(uploadResult);
      
      // Reset form after short delay to show 100% progress
      setTimeout(() => {
        setSelectedFile(null);
        setUploadProgress(0);
        setIsUploading(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }, 1000);
      
    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err.message || 'Upload failed');
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const resetSelection = () => {
    setSelectedFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={styles.container}>
      {error && (
        <div className={styles.error}>
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}
      
      {!selectedFile ? (
        <>
          <label className={styles.uploadLabel}>
            <input
              ref={fileInputRef}
              type="file"
              accept={allowedTypes.join(',')}
              onChange={handleFileSelect}
              className={styles.fileInput}
              disabled={isUploading}
            />
            <div className={styles.uploadArea}>
              <UploadCloud size={24} />
              <p className={styles.uploadText}>
                {uploadType === 'image' 
                  ? 'Click to upload an image' 
                  : 'Click to upload a document'}
              </p>
              <p className={styles.uploadHint}>
                {uploadType === 'image'
                  ? `JPG, PNG or GIF (max. ${MAX_IMAGE_SIZE / (1024 * 1024)}MB)`
                  : `PDF, DOC or DOCX (max. ${MAX_DOCUMENT_SIZE / (1024 * 1024)}MB)`}
              </p>
            </div>
          </label>
        </>
      ) : (
        <div className={styles.selectedFile}>
          <div className={styles.fileInfo}>
            <span className={styles.fileName}>{selectedFile.name}</span>
            <span className={styles.fileSize}>
              {(selectedFile.size / 1024).toFixed(1)} KB
            </span>
          </div>
          
          {isUploading ? (
            <div className={styles.progressContainer}>
              <div 
                className={styles.progressBar} 
                style={{ width: `${uploadProgress}%` }}
              />
              <span className={styles.progressText}>{uploadProgress}%</span>
            </div>
          ) : (
            <div className={styles.actions}>
              <button 
                onClick={resetSelection} 
                className={styles.cancelButton}
                type="button"
              >
                <X size={16} />
              </button>
              <button 
                onClick={handleUpload} 
                className={styles.uploadButton}
                type="button"
              >
                Upload
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
'use client';

import { useState, useEffect, useRef } from 'react';
import { propertyService } from '@/lib/services/propertyService';
import { PropertyImage } from '@/types/supabase';
import styles from '../styles/PropertyImages.module.css';

interface PropertyImagesProps {
  propertyId: string;
}

export default function PropertyImages({ propertyId }: PropertyImagesProps) {
  const [images, setImages] = useState<PropertyImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<PropertyImage | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function loadImages() {
      setIsLoading(true);
      try {
        const { data, error } = await propertyService.getPropertyImages(propertyId);
        if (error) throw new Error(error.message);
        
        setImages(data || []);
      } catch (err) {
        console.error('Error loading property images:', err);
        setError('Failed to load property images');
      } finally {
        setIsLoading(false);
      }
    }

    loadImages();
  }, [propertyId]);

  const handleImageClick = (image: PropertyImage) => {
    setSelectedImage(image);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    const fileList = Array.from(files);
    setUploadedFiles(fileList);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const fileList = Array.from(e.dataTransfer.files);
      // Filter to only include image files
      const imageFiles = fileList.filter(file => file.type.startsWith('image/'));
      setUploadedFiles(imageFiles);
    }
  };

  const handleUploadImages = async () => {
    if (uploadedFiles.length === 0) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      let completedUploads = 0;
      const totalFiles = uploadedFiles.length;
      
      for (const file of uploadedFiles) {
        await propertyService.uploadPropertyImage(propertyId, file);
        completedUploads++;
        setUploadProgress(Math.round((completedUploads / totalFiles) * 100));
      }
      
      // Reload images after successful upload
      const { data } = await propertyService.getPropertyImages(propertyId);
      setImages(data || []);
      
      // Reset form
      setUploadedFiles([]);
      setIsUploadModalOpen(false);
    } catch (err) {
      console.error('Error uploading images:', err);
      setError('Failed to upload images');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleSetPrimaryImage = async (imageId: string) => {
    try {
      await propertyService.setPrimaryPropertyImage(propertyId, imageId);
      
      // Update local state to reflect the change
      setImages(prevImages => 
        prevImages.map(img => ({
          ...img,
          is_primary: img.id === imageId
        }))
      );
    } catch (err) {
      console.error('Error setting primary image:', err);
      setError('Failed to set primary image');
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return;
    
    try {
      await propertyService.deletePropertyImage(propertyId, imageId);
      
      // Remove the deleted image from local state
      setImages(prevImages => prevImages.filter(img => img.id !== imageId));
    } catch (err) {
      console.error('Error deleting image:', err);
      setError('Failed to delete image');
    }
  };

  const getImageUrl = (image: PropertyImage) => {
    // This would need to be adjusted based on your Supabase storage configuration
    return image.url || `https://your-supabase-project.supabase.co/storage/v1/object/public/properties/${image.storage_path}`;
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading property images...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p className={styles.errorMessage}>{error}</p>
        <button 
          className={styles.retryButton}
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Property Images</h3>
        <button 
          className={styles.uploadButton}
          onClick={() => setIsUploadModalOpen(true)}
        >
          Add Images
        </button>
      </div>

      {images.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No images yet. Add photos to showcase this property.</p>
          <button 
            className={styles.uploadButton}
            onClick={() => setIsUploadModalOpen(true)}
          >
            Upload First Image
          </button>
        </div>
      ) : (
        <div className={styles.imageGrid}>
          {images.map((image) => (
            <div 
              key={image.id} 
              className={`${styles.imageContainer} ${image.is_primary ? styles.primaryImage : ''}`}
            >
              <img
                src={getImageUrl(image)}
                alt={`Property image ${image.id}`}
                className={styles.image}
                onClick={() => handleImageClick(image)}
              />
              <div className={styles.imageControls}>
                <button
                  className={`${styles.controlButton} ${image.is_primary ? styles.primaryButton : ''}`}
                  onClick={() => handleSetPrimaryImage(image.id)}
                  disabled={image.is_primary}
                  title={image.is_primary ? 'Primary Image' : 'Set as Primary'}
                >
                  {image.is_primary ? '★' : '☆'}
                </button>
                <button
                  className={`${styles.controlButton} ${styles.deleteButton}`}
                  onClick={() => handleDeleteImage(image.id)}
                  title="Delete Image"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Image Viewer Modal */}
      {isModalOpen && selectedImage && (
        <div className={styles.modalBackdrop} onClick={handleCloseModal}>
          <div className={styles.imageModal} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeModalButton} onClick={handleCloseModal}>
              ×
            </button>
            <img
              src={getImageUrl(selectedImage)}
              alt={`Property image ${selectedImage.id}`}
              className={styles.modalImage}
            />
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className={styles.modalBackdrop}>
          <div className={styles.uploadModal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h4>Upload Property Images</h4>
              <button 
                className={styles.closeButton}
                onClick={() => setIsUploadModalOpen(false)}
              >
                ×
              </button>
            </div>
            
            <div 
              className={styles.dropZone}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className={styles.fileInput}
                accept="image/*"
                multiple
              />
              {uploadedFiles.length === 0 ? (
                <>
                  <div className={styles.uploadIcon}>📁</div>
                  <p>Drag and drop images here or click to browse</p>
                  <p className={styles.supportedFormats}>
                    Supported formats: JPG, PNG, GIF
                  </p>
                </>
              ) : (
                <div className={styles.selectedFiles}>
                  <p>{uploadedFiles.length} file(s) selected:</p>
                  <ul className={styles.fileList}>
                    {uploadedFiles.map((file, index) => (
                      <li key={index} className={styles.fileItem}>
                        {file.name} ({(file.size / 1024).toFixed(1)} KB)
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            {isUploading && (
              <div className={styles.uploadProgress}>
                <div 
                  className={styles.progressBar} 
                  style={{ width: `${uploadProgress}%` }}
                ></div>
                <span className={styles.progressText}>
                  {uploadProgress}% Complete
                </span>
              </div>
            )}
            
            <div className={styles.modalFooter}>
              <button 
                className={styles.cancelButton}
                onClick={() => {
                  setIsUploadModalOpen(false);
                  setUploadedFiles([]);
                }}
                disabled={isUploading}
              >
                Cancel
              </button>
              <button 
                className={styles.confirmButton}
                onClick={handleUploadImages}
                disabled={uploadedFiles.length === 0 || isUploading}
              >
                {isUploading 
                  ? `Uploading (${uploadProgress}%)` 
                  : `Upload ${uploadedFiles.length > 0 ? uploadedFiles.length : ''} Image${uploadedFiles.length !== 1 ? 's' : ''}`
                }
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { propertyService } from '@/lib/services/propertyService';
import { PropertyDocument } from '@/types/supabase';
import styles from './PropertyDocuments.module.css';

interface PropertyDocumentsProps {
  propertyId: string;
}

export default function PropertyDocuments({ propertyId }: PropertyDocumentsProps) {
  const [documents, setDocuments] = useState<PropertyDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [documentType, setDocumentType] = useState('plans');
  const [documentDescription, setDocumentDescription] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const documentTypes = [
    { value: 'plans', label: 'Plans & Drawings' },
    { value: 'planning_application', label: 'Planning Application' },
    { value: 'survey', label: 'Survey Report' },
    { value: 'legal', label: 'Legal Document' },
    { value: 'structural', label: 'Structural Report' },
    { value: 'building_control', label: 'Building Control' },
    { value: 'specification', label: 'Specification' },
    { value: 'other', label: 'Other' }
  ];

  useEffect(() => {
    async function loadDocuments() {
      setIsLoading(true);
      try {
        const { data, error } = await propertyService.getPropertyDocuments(propertyId);
        if (error) throw new Error(error.message);
        
        setDocuments(data || []);
      } catch (err) {
        console.error('Error loading property documents:', err);
        setError('Failed to load property documents');
      } finally {
        setIsLoading(false);
      }
    }

    loadDocuments();
  }, [propertyId]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    setSelectedFile(files[0]);
  };

  const handleUploadDocument = async () => {
    if (!selectedFile) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return 95;
          }
          return prev + 5;
        });
      }, 100);

      const { data, error } = await propertyService.uploadPropertyDocument(
        propertyId,
        selectedFile,
        documentType,
        documentDescription || undefined
      );

      clearInterval(progressInterval);
      setUploadProgress(100);
      
      if (error) throw error;
      
      // Reload documents after successful upload
      const { data: updatedDocuments } = await propertyService.getPropertyDocuments(propertyId);
      setDocuments(updatedDocuments || []);
      
      // Reset form
      setSelectedFile(null);
      setDocumentDescription('');
      setIsUploadModalOpen(false);
    } catch (err) {
      console.error('Error uploading document:', err);
      setError('Failed to upload document');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const getDocumentTypeLabel = (type: string) => {
    const documentType = documentTypes.find(dt => dt.value === type);
    return documentType ? documentType.label : type;
  };

  const getDocumentUrl = (path: string) => {
    // This would need to be adjusted based on your Supabase storage configuration
    return `https://your-supabase-project.supabase.co/storage/v1/object/public/properties/${path}`;
  };

  const formatFileSize = (sizeInBytes: number) => {
    if (sizeInBytes < 1024) {
      return `${sizeInBytes} B`;
    } else if (sizeInBytes < 1024 * 1024) {
      return `${(sizeInBytes / 1024).toFixed(1)} KB`;
    } else {
      return `${(sizeInBytes / (1024 * 1024)).toFixed(1)} MB`;
    }
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) {
      return '📄';
    } else if (fileType.includes('image')) {
      return '🖼️';
    } else if (fileType.includes('word') || fileType.includes('document')) {
      return '📝';
    } else if (fileType.includes('excel') || fileType.includes('spreadsheet')) {
      return '📊';
    } else if (fileType.includes('zip') || fileType.includes('compressed')) {
      return '🗜️';
    } else {
      return '📎';
    }
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading property documents...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p className={styles.errorMessage}>{error}</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Property Documents</h3>
        <button 
          className={styles.uploadButton}
          onClick={() => setIsUploadModalOpen(true)}
        >
          Upload Document
        </button>
      </div>

      {documents.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No documents yet. Upload your first property document.</p>
        </div>
      ) : (
        <div className={styles.documentsList}>
          {documents.map((document) => (
            <div key={document.id} className={styles.documentItem}>
              <div className={styles.documentIcon}>
                {getFileIcon(document.file_type)}
              </div>
              <div className={styles.documentInfo}>
                <a 
                  href={getDocumentUrl(document.storage_path)} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.documentTitle}
                >
                  {document.file_name}
                </a>
                <div className={styles.documentMeta}>
                  <span className={styles.documentType}>
                    {getDocumentTypeLabel(document.document_type)}
                  </span>
                  <span className={styles.documentSize}>
                    {formatFileSize(document.file_size)}
                  </span>
                  <span className={styles.documentDate}>
                    {new Date(document.created_at).toLocaleDateString()}
                  </span>
                </div>
                {document.description && (
                  <p className={styles.documentDescription}>{document.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {isUploadModalOpen && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h4>Upload Document</h4>
              <button 
                className={styles.closeButton}
                onClick={() => setIsUploadModalOpen(false)}
              >
                ×
              </button>
            </div>
            
            <div className={styles.modalContent}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Document Type</label>
                <select 
                  className={styles.select}
                  value={documentType}
                  onChange={(e) => setDocumentType(e.target.value)}
                >
                  {documentTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.label}>Description (optional)</label>
                <textarea 
                  className={styles.textarea}
                  value={documentDescription}
                  onChange={(e) => setDocumentDescription(e.target.value)}
                  placeholder="Add a brief description of this document"
                  rows={3}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.fileInputLabel}>
                  {selectedFile ? selectedFile.name : 'Select Document'}
                  <input 
                    type="file" 
                    onChange={handleFileChange} 
                    className={styles.fileInput}
                  />
                </label>
              </div>
              
              {isUploading && (
                <div className={styles.uploadProgress}>
                  <div 
                    className={styles.progressBar} 
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                  <span className={styles.progressText}>{uploadProgress}%</span>
                </div>
              )}
            </div>
            
            <div className={styles.modalFooter}>
              <button 
                className={styles.cancelButton}
                onClick={() => setIsUploadModalOpen(false)}
                disabled={isUploading}
              >
                Cancel
              </button>
              <button 
                className={styles.confirmButton}
                onClick={handleUploadDocument}
                disabled={!selectedFile || isUploading}
              >
                {isUploading ? 'Uploading...' : 'Upload Document'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
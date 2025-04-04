// app/properties/[id]/components/DeletePropertyButton.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { propertyService } from '@/lib/services/propertyService';
import styles from '../styles/PropertyPage.module.css';

interface DeletePropertyButtonProps {
  propertyId: string;
  onDelete?: () => void; // Optional callback after successful deletion
}

export default function DeletePropertyButton({ propertyId, onDelete }: DeletePropertyButtonProps) {
  const router = useRouter();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!propertyId) return;
    
    setIsDeleting(true);
    try {
      const { error } = await propertyService.deleteProperty(propertyId);
      
      if (error) throw error;
      
      setIsDeleteModalOpen(false);
      
      // Call the onDelete callback if provided
      if (onDelete) {
        onDelete();
      } else {
        // Default behavior if no callback provided
        router.push('/properties');
        router.refresh(); // Refresh the current page to update any cached data
      }
    } catch (err) {
      console.error('Error deleting property:', err);
      setError('Failed to delete property');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsDeleteModalOpen(true)}
        className={styles.deleteButton}
      >
        Delete Property
      </button>

      {isDeleteModalOpen && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modal}>
            <h3 className={styles.modalTitle}>Confirm Deletion</h3>
            <p>Are you sure you want to delete this property? This action cannot be undone.</p>
            {error && <p className={styles.errorMessage}>{error}</p>}
            <div className={styles.modalActions}>
              <button 
                onClick={() => setIsDeleteModalOpen(false)}
                className={styles.cancelModalButton}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button 
                onClick={handleDelete}
                className={styles.confirmDeleteButton}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete Property'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
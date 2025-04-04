// app/properties/add/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import PropertyForm from '@/components/property/PropertyForm';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { PropertyInsert, PropertyUpdate } from '@/types/supabase';
import { supabase } from '@/lib/supabase/client';
import styles from './styles/AddProperty.module.css';

export default function AddPropertyPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (propertyData: PropertyInsert | PropertyUpdate) => {
    try {
      setIsSubmitting(true);
      setError(null);

      // Get current user
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/auth/login?redirectTo=/properties/add');
        return;
      }

      // Cast to PropertyInsert and add user_id
      const propertyInsertData = propertyData as PropertyInsert;
      propertyInsertData.user_id = session.user.id;
      
      // Insert the new property
      const { data, error } = await supabase
        .from('properties')
        .insert(propertyInsertData)
        .select('id')
        .single();
        
      if (error) throw error;
      
      // Navigate to the newly created property page
      router.push(`/properties/${data.id}`);
      
    } catch (err: any) {
      console.error('Error adding property:', err);
      setError(err.message || 'Failed to add property');
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      {isSubmitting ? (
        <div className={styles.loadingContainer}>
          <LoadingSpinner />
          <p>Creating property...</p>
        </div>
      ) : (
        <div className={styles.formContainer}>
          <h1 className={styles.title}>Add New Property</h1>
          
          <div className={styles.formNotification}>
            <h3 className={styles.formNotificationTitle}>Getting Started</h3>
            <p className={styles.formNotificationText}>
              Creating a property will allow you to manage planning applications, party wall notices, and find contractors for your project.
            </p>
          </div>
          
          {error && (
            <div className={styles.errorMessage}>
              <p>{error}</p>
            </div>
          )}
          
          <PropertyForm 
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            submitButtonText="Create Property"
            submitButtonClassName={styles.submitButton}
          />
          
          <div className={styles.actionsContainer}>
            <Link href="/properties" className={styles.backButton}>
              Cancel
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

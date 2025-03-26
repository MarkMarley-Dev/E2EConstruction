// app/properties/[id]/edit/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Property, PropertyUpdate, Database } from '@/types/supabase';
import PropertyForm from '@/components/property/PropertyForm';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import styles from '@/styles/PropertyEdit.module.css';

export default function EditPropertyPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const supabase = createClientComponentClient<Database>();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProperty() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .eq('id', params.id)
          .single();

        if (error) {
          throw error;
        }

        setProperty(data);
      } catch (err: any) {
        console.error('Error fetching property:', err.message);
        setError('Failed to load property details');
      } finally {
        setLoading(false);
      }
    }

    fetchProperty();
  }, [params.id, supabase]);

  const handleSubmit = async (formData: PropertyUpdate) => {
    setSubmitting(true);
    try {
      // Add updated_at timestamp
      const dataToUpdate = {
        ...formData,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('properties')
        .update(dataToUpdate)
        .eq('id', params.id);

      if (error) {
        throw error;
      }

      router.push(`/properties/${params.id}`);
      // Use a toast notification here instead of alert if you have that set up
      alert('Property updated successfully');
    } catch (err: any) {
      console.error('Error updating property:', err.message);
      setError('Failed to update property');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push(`/properties/${params.id}`);
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.formContainer}>
          <div className={styles.errorMessage}>
            <h1 className={styles.title}>Error</h1>
            <p>{error}</p>
            <button 
              className={styles.backButton}
              onClick={() => router.push('/properties')}
            >
              Back to Properties
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <h1 className={styles.title}>Edit Property</h1>
        {property ? (
          <PropertyForm
            initialData={property}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isSubmitting={submitting}
          />
        ) : (
          <p className={styles.notFound}>Property not found</p>
        )}
      </div>
    </div>
  );
}
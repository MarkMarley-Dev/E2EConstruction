// app/properties/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import PropertyList from '@/components/property/PropertyList';
import { Property } from '@/types/supabase';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import styles from './styles/PropertyPage.module.css'

export default function PropertiesPage() {
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProperties() {
      try {
        setLoading(true);
        
        // Get current user
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          // Handle not authenticated - middleware should handle this, but just in case
          router.push('/auth/login?redirectTo=/properties');
          return;
        }
        
        // Fetch properties for the current user
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        setProperties(data || []);
      } catch (err: any) {
        console.error('Error fetching properties:', err);
        setError(err.message || 'Failed to load properties');
      } finally {
        setLoading(false);
      }
    }
    
    fetchProperties();
  }, [router]);

  const handleAddProperty = () => {
    router.push('/properties/add');
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <LoadingSpinner />
        <p>Loading properties...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <h2>Error</h2>
        <p>{error}</p>
        <button 
          className={styles.button}
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
        <h1 className={styles.title}>My Properties</h1>
        <button 
          className={styles.addButton}
          onClick={handleAddProperty}
        >
          Add Property
        </button>
      </div>
      
      {properties.length === 0 ? (
        <div className={styles.emptyState}>
          <h2>No Properties Found</h2>
          <p>You haven't added any properties yet.</p>
          <button 
            className={styles.button}
            onClick={handleAddProperty}
          >
            Add Your First Property
          </button>
        </div>
      ) : (
        <PropertyList properties={properties} />
      )}
    </div>
  );
}
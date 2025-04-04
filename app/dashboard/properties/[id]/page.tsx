// app/properties/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { use } from 'react';
import { propertyService } from '@/lib/services/propertyService';
import { Property } from '@/types/supabase';
import PropertyImages from './components/PropertyImages';
import PropertyDocuments from './components/PropertyDocuments';
import DeletePropertyButton from './components/DeletePropertyButton';
import styles from './styles/PropertyPage.module.css';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function PropertyDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  
  const router = useRouter();
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProperty() {
      setIsLoading(true);
      try {
        const { data, error } = await propertyService.getPropertyById(id);
        if (error) {
          throw new Error(error.message || 'Failed to load property');
        }
        if (!data) {
          throw new Error('Property not found');
        }
        setProperty(data);
      } catch (err: any) {
        console.error('Error loading property:', err);
        setError(err.message || 'An error occurred while loading the property');
      } finally {
        setIsLoading(false);
      }
    }

    loadProperty();
  }, [id]);

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading property details...</p>
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
          onClick={() => router.push('/properties')}
        >
          Back to Properties
        </button>
      </div>
    );
  }

  if (!property) {
    return (
      <div className={styles.errorContainer}>
        <h2>Property Not Found</h2>
        <p>The property you're looking for doesn't exist or you don't have permission to view it.</p>
        <button 
          className={styles.button}
          onClick={() => router.push('/properties')}
        >
          Back to Properties
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          {property.property_name || `Property at ${property.address_line1}`}
        </h1>
        <div className={styles.actions}>
          <button 
            className={styles.editButton}
            onClick={() => router.push(`/properties/${id}/edit`)}
          >
            Edit Property
          </button>
          <DeletePropertyButton propertyId={id} onDelete={() => router.push('/properties')} />
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.mainContent}>
          <PropertyImages propertyId={id} />
          
          <div className={styles.detailsCard}>
            <h2 className={styles.sectionTitle}>Property Details</h2>
            <div className={styles.detailsGrid}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Address</span>
                <span className={styles.detailValue}>
                  {property.address_line1}
                  {property.address_line2 && <br />}
                  {property.address_line2}
                  <br />
                  {property.city}, {property.postal_code}
                  {property.county && <><br />{property.county}</>}
                </span>
              </div>
              
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Property Type</span>
                <span className={styles.detailValue}>
                  {property.property_type.replace('_', ' ')}
                </span>
              </div>
              
              {property.year_built && (
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Year Built</span>
                  <span className={styles.detailValue}>{property.year_built}</span>
                </div>
              )}
              
              {property.floor_area_sqm && (
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Floor Area</span>
                  <span className={styles.detailValue}>{property.floor_area_sqm} m²</span>
                </div>
              )}
              
              {property.land_area_sqm && (
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Land Area</span>
                  <span className={styles.detailValue}>{property.land_area_sqm} m²</span>
                </div>
              )}
              
              {property.num_bedrooms && (
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Bedrooms</span>
                  <span className={styles.detailValue}>{property.num_bedrooms}</span>
                </div>
              )}
              
              {property.num_bathrooms && (
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Bathrooms</span>
                  <span className={styles.detailValue}>{property.num_bathrooms}</span>
                </div>
              )}
              
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Planning Authority</span>
                <span className={styles.detailValue}>
                  {property.planning_authority || 'Not specified'}
                </span>
              </div>
              
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Conservation Area</span>
                <span className={styles.detailValue}>
                  {property.conservation_area ? 'Yes' : 'No'}
                </span>
              </div>
              
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Listed Building</span>
                <span className={styles.detailValue}>
                  {property.listed_building 
                    ? `Yes${property.listed_building_grade ? ` (Grade ${property.listed_building_grade})` : ''}` 
                    : 'No'}
                </span>
              </div>
            </div>
            
            {property.description && (
              <div className={styles.description}>
                <h3>Description</h3>
                <p>{property.description}</p>
              </div>
            )}
          </div>
          
          <PropertyDocuments propertyId={id} />
        </div>
        
        <div className={styles.sidebar}>
          {/* Sidebar content for future use (e.g., planning status, projects) */}
        </div>
      </div>
    </div>
  );
}
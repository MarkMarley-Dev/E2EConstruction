/**
 * File: app/components/projects/ProjectProperty.tsx
 * Project Property Component - Shows property details associated with the project
 */

import Link from 'next/link';
import Image from 'next/image';
import styles from './styles/ProjectProperty.module.css';

interface PropertyType {
  id: string;
  address: string;
  city?: string;
  postcode?: string;
  property_type?: string;
  year_built?: number;
  bedrooms?: number;
  bathrooms?: number;
  image_urls?: string[];
  owner_id: string;
  created_at?: string;
}

interface ProjectPropertyProps {
  property: PropertyType | null;
}

export default function ProjectProperty({ property }: ProjectPropertyProps) {
  if (!property) {
    return (
      <div className={styles.noProperty}>
        <p>No property associated with this project yet.</p>
        <Link href="/dashboard/properties/add" className="button secondary">
          Add Property
        </Link>
      </div>
    );
  }

  // Format full address
  const fullAddress = [
    property.address,
    property.city,
    property.postcode
  ].filter(Boolean).join(', ');

  return (
    <div className={styles.propertyContainer}>
      {property.image_urls && property.image_urls.length > 0 ? (
        <div className={styles.propertyImage}>
          <Image 
            src={property.image_urls[0]} 
            alt={property.address}
            width={300}
            height={200}
            className={styles.image}
          />
        </div>
      ) : (
        <div className={styles.propertyImagePlaceholder}>
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
        </div>
      )}

      <div className={styles.propertyDetails}>
        <h3 className={styles.propertyAddress}>{property.address}</h3>
        {property.city && property.postcode && (
          <p className={styles.propertyLocation}>{property.city}, {property.postcode}</p>
        )}
        
        <div className={styles.propertySpecs}>
          {property.property_type && (
            <div className={styles.propertySpec}>
              <span className={styles.specLabel}>Type:</span>
              <span className={styles.specValue}>{property.property_type}</span>
            </div>
          )}
          
          {property.year_built && (
            <div className={styles.propertySpec}>
              <span className={styles.specLabel}>Built:</span>
              <span className={styles.specValue}>{property.year_built}</span>
            </div>
          )}
          
          {property.bedrooms !== undefined && (
            <div className={styles.propertySpec}>
              <span className={styles.specLabel}>Bedrooms:</span>
              <span className={styles.specValue}>{property.bedrooms}</span>
            </div>
          )}
          
          {property.bathrooms !== undefined && (
            <div className={styles.propertySpec}>
              <span className={styles.specLabel}>Bathrooms:</span>
              <span className={styles.specValue}>{property.bathrooms}</span>
            </div>
          )}
        </div>
      </div>
      
      <Link 
        href={`/dashboard/properties/${property.id}`}
        className={`${styles.viewPropertyLink} button secondary`}
      >
        View Property Details
      </Link>
    </div>
  );
}
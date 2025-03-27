// app/components/property/PropertyCard.tsx
import Link from 'next/link';
import { Property } from '@/types/supabase';
import styles from './styles/PropertyCard.module.css';

interface PropertyCardProps {
  property: Property;
  onClick?: () => void
}

export default function PropertyCard({ property }: PropertyCardProps) {
  // Get address with formatting
  const formattedAddress = [
    property.address_line1,
    property.address_line2,
    property.city,
    property.postal_code
  ].filter(Boolean).join(', ');

  // Get property type with proper formatting
  const getPropertyTypeLabel = (type: string) => {
    switch (type) {
      case 'residential':
        return 'Residential';
      case 'commercial':
        return 'Commercial';
      case 'mixed_use':
        return 'Mixed Use';
      case 'land':
        return 'Land';
      default:
        return type;
    }
  };

  // Get icon based on property type
  const getPropertyTypeIcon = (type: string) => {
    switch (type) {
      case 'residential':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className={styles.cardTypeIcon} viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
        );
      case 'commercial':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className={styles.cardTypeIcon} viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
          </svg>
        );
      case 'mixed_use':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className={styles.cardTypeIcon} viewBox="0 0 20 20" fill="currentColor">
            <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
          </svg>
        );
      case 'land':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className={styles.cardTypeIcon} viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className={styles.cardTypeIcon} viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
        );
    }
  };

  return (
    <Link href={`/dashboard/properties/${property.id}`}>
      <div className={styles.card}>
        <div className={styles.cardBody}>
          <div className={styles.cardHeader}>
            <div>
              <h3 className={styles.cardTitle}>
                {property.property_name || formattedAddress}
              </h3>
              {property.property_name && (
                <p className={styles.cardAddress}>{formattedAddress}</p>
              )}
            </div>
            <div className={styles.cardTypeTag}>
              {getPropertyTypeIcon(property.property_type)}
              <span>{getPropertyTypeLabel(property.property_type)}</span>
            </div>
          </div>
          
          <div className={styles.cardDetails}>
            {property.planning_authority && (
              <div>
                <span className={styles.cardDetailLabel}>Planning Authority:</span>
                <p className={styles.cardDetailValue}>{property.planning_authority}</p>
              </div>
            )}
            
            {property.year_built && (
              <div>
                <span className={styles.cardDetailLabel}>Year Built:</span>
                <p className={styles.cardDetailValue}>{property.year_built}</p>
              </div>
            )}
            
            {property.floor_area_sqm && (
              <div>
                <span className={styles.cardDetailLabel}>Floor Area:</span>
                <p className={styles.cardDetailValue}>{property.floor_area_sqm} m²</p>
              </div>
            )}
            
            {(property.num_bedrooms || property.num_bedrooms === 0) && (
              <div>
                <span className={styles.cardDetailLabel}>Bedrooms:</span>
                <p className={styles.cardDetailValue}>{property.num_bedrooms}</p>
              </div>
            )}
          </div>
          
          <div className={styles.cardTags}>
            {property.conservation_area && (
              <span className={`${styles.cardTag} ${styles.cardTagConservation}`}>
                Conservation Area
              </span>
            )}
            {property.listed_building && (
              <span className={`${styles.cardTag} ${styles.cardTagListed}`}>
                {property.listed_building_grade ? `Listed (${property.listed_building_grade})` : 'Listed Building'}
              </span>
            )}
          </div>
        </div>
        
        <div className={styles.cardFooter}>
          <div className={styles.cardDate}>
            Added {new Date(property.created_at).toLocaleDateString()}
          </div>
          <span className={styles.cardLink}>
            View details
            <svg className={styles.cardLinkIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}
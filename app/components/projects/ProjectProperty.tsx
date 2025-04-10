/**
 * File: app/components/projects/ProjectProperty.tsx
 * Updated Property Component with proper field mapping and TypeScript fixes
 */

'use client';

import Link from 'next/link';
import styles from './styles/ProjectProperty.module.css';
import { useState, useEffect } from 'react';

interface FormValues {
  property_name?: string;
  property_type: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  postal_code: string;
  country: string;
  area_sqm?: string;
  construction_year?: string;
  bedrooms?: string;
  bathrooms?: string;
  description?: string;
  [key: string]: string | undefined;
}

interface ProjectPropertyProps {
  property: any;
  isEditing?: boolean;
  onChange?: (updatedProperty: any) => void;
}

export default function ProjectProperty({ property, isEditing = false, onChange }: ProjectPropertyProps) {
  // Local state to maintain the form values for UI display
  const [formValues, setFormValues] = useState<FormValues>({
    property_type: 'residential',
    address_line1: '',
    city: '',
    postal_code: '',
    country: 'United Kingdom'
  });

  useEffect(() => {
    if (property) {
      // Map database field names to UI field names for initial display
      setFormValues({
        // Direct fields
        property_name: property.property_name || '',
        property_type: property.property_type || 'residential',
        address_line1: property.address_line1 || '',
        address_line2: property.address_line2 || '',
        city: property.city || '',
        postal_code: property.postal_code || '',
        country: property.country || 'United Kingdom',
        
        // Mapped fields for UI
        area_sqm: property.floor_area_sqm?.toString() || '',
        construction_year: property.year_built?.toString() || '',
        bedrooms: property.num_bedrooms?.toString() || '',
        bathrooms: property.num_bathrooms?.toString() || '',
        description: property.description || ''
      });
    }
  }, [property]);

  if (!property) {
    return (
      <div className={styles.emptyState}>
        <p>No property associated with this project.</p>
        <Link href="/dashboard/properties/add" className="button secondary">
          Add Property
        </Link>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Update local form state
    setFormValues((prev: FormValues) => ({
      ...prev,
      [name]: value
    }));
    
    if (onChange) {
      // Map UI field names to database field names when passing up
      let dbFieldName = name;
      let dbValue: string | number | null = value;
      
      switch (name) {
        case 'area_sqm':
          dbFieldName = 'floor_area_sqm';
          dbValue = value === '' ? null : parseFloat(value);
          break;
        case 'construction_year':
          dbFieldName = 'year_built';
          dbValue = value === '' ? null : parseInt(value, 10);
          break;
        case 'bedrooms':
          dbFieldName = 'num_bedrooms';
          dbValue = value === '' ? null : parseInt(value, 10);
          break;
        case 'bathrooms':
          dbFieldName = 'num_bathrooms';
          dbValue = value === '' ? null : parseFloat(value);
          break;
        default:
          // For all other fields, keep the same name
          dbValue = value === '' ? null : value;
      }
      
      onChange({
        [dbFieldName]: dbValue
      });
    }
  };

  // Function to capitalize first letter of each word
  const formatPropertyType = (type: string): string => {
    if (!type) return 'Not specified';
    return type.split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const propertyType = formatPropertyType(property.property_type || 'residential');

  return (
    <div className={styles.propertyCard}>
      {isEditing ? (
        // Editable property view
        <div className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="property_name">Property Name (Optional)</label>
            <input
              type="text"
              id="property_name"
              name="property_name"
              value={formValues.property_name || ''}
              onChange={handleChange}
              className={styles.input}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="address_line1">Address Line 1</label>
            <input
              type="text"
              id="address_line1"
              name="address_line1"
              value={formValues.address_line1}
              onChange={handleChange}
              required
              className={styles.input}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="address_line2">Address Line 2</label>
            <input
              type="text"
              id="address_line2"
              name="address_line2"
              value={formValues.address_line2 || ''}
              onChange={handleChange}
              className={styles.input}
            />
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="city">City</label>
              <input
                type="text"
                id="city"
                name="city"
                value={formValues.city}
                onChange={handleChange}
                required
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="postal_code">Postal Code</label>
              <input
                type="text"
                id="postal_code"
                name="postal_code"
                value={formValues.postal_code}
                onChange={handleChange}
                required
                className={styles.input}
              />
            </div>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="property_type">Property Type</label>
            <select
              id="property_type"
              name="property_type"
              value={formValues.property_type}
              onChange={handleChange}
              className={styles.select}
            >
              <option value="residential">Residential</option>
              <option value="commercial">Commercial</option>
              <option value="industrial">Industrial</option>
              <option value="land">Land</option>
            </select>
          </div>
          {formValues.property_type === 'residential' && (
            <>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="bedrooms">Bedrooms</label>
                  <input
                    type="number"
                    id="bedrooms"
                    name="bedrooms"
                    value={formValues.bedrooms || ''}
                    onChange={handleChange}
                    min="0"
                    className={styles.input}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="bathrooms">Bathrooms</label>
                  <input
                    type="number"
                    id="bathrooms"
                    name="bathrooms"
                    value={formValues.bathrooms || ''}
                    onChange={handleChange}
                    min="0"
                    step="0.5"
                    className={styles.input}
                  />
                </div>
              </div>
            </>
          )}
          <div className={styles.formGroup}>
            <label htmlFor="area_sqm">Floor Area (m²)</label>
            <input
              type="number"
              id="area_sqm"
              name="area_sqm"
              value={formValues.area_sqm || ''}
              onChange={handleChange}
              min="0"
              className={styles.input}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="construction_year">Year Built</label>
            <input
              type="number"
              id="construction_year"
              name="construction_year"
              value={formValues.construction_year || ''}
              onChange={handleChange}
              min="1800"
              max={new Date().getFullYear()}
              className={styles.input}
            />
          </div>
        </div>
      ) : (
        // Read-only property view
        <div className={styles.propertyContent}>
          <div className={styles.propertyHeader}>
            <div className={styles.propertyTypeTag} style={{ 
              backgroundColor: 
                property.property_type === 'residential' ? 'var(--color-primary-light)' :
                property.property_type === 'commercial' ? 'var(--color-secondary-light)' :
                property.property_type === 'industrial' ? 'var(--color-accent-light)' :
                'var(--color-gray-400)'
            }}>
              {propertyType}
            </div>
          </div>
          
          <div className={styles.addressContainer}>
            <div className={styles.addressIcon}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
            </div>
            <div className={styles.address}>
              <p className={styles.addressLine}>{property.address_line1}</p>
              {property.address_line2 && <p className={styles.addressLine}>{property.address_line2}</p>}
              <p className={styles.addressLine}>{property.city}, {property.postal_code}</p>
            </div>
          </div>
          
          <div className={styles.propertyDetails}>
            <div className={styles.detailsGrid}>
              {property.num_bedrooms && (
                <div className={styles.detailItem}>
                  <div className={styles.detailIcon}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 4v16"></path>
                      <path d="M22 4v16"></path>
                      <path d="M4 8h16"></path>
                      <path d="M4 16h16"></path>
                      <path d="M8 4v4"></path>
                      <path d="M16 4v4"></path>
                      <path d="M8 16v4"></path>
                      <path d="M16 16v4"></path>
                    </svg>
                  </div>
                  <div className={styles.detailContent}>
                    <span className={styles.detailValue}>{property.num_bedrooms}</span>
                    <span className={styles.detailLabel}>Bedrooms</span>
                  </div>
                </div>
              )}
              
              {property.num_bathrooms && (
                <div className={styles.detailItem}>
                  <div className={styles.detailIcon}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 12h16"></path>
                      <path d="M4 12a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-4z"></path>
                      <path d="M6 12V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v6"></path>
                    </svg>
                  </div>
                  <div className={styles.detailContent}>
                    <span className={styles.detailValue}>{property.num_bathrooms}</span>
                    <span className={styles.detailLabel}>Bathrooms</span>
                  </div>
                </div>
              )}
              
              {property.floor_area_sqm && (
                <div className={styles.detailItem}>
                  <div className={styles.detailIcon}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    </svg>
                  </div>
                  <div className={styles.detailContent}>
                    <span className={styles.detailValue}>{property.floor_area_sqm}</span>
                    <span className={styles.detailLabel}>Area (m²)</span>
                  </div>
                </div>
              )}
              
              {property.year_built && (
                <div className={styles.detailItem}>
                  <div className={styles.detailIcon}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                  </div>
                  <div className={styles.detailContent}>
                    <span className={styles.detailValue}>{property.year_built}</span>
                    <span className={styles.detailLabel}>Year Built</span>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className={styles.propertyActions}>
            <Link href={`/dashboard/properties/${property.id}`} className="button secondary small">
              View Property Details
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
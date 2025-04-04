// components/PropertyForm.tsx
'use client';

import { useState, useEffect } from 'react';
import { Property, PropertyUpdate, PropertyInsert } from '@/types/supabase';
import styles from './styles/PropertyForm.module.css';

interface PropertyFormProps {
  initialData?: Property;
  onSubmit: (formData: PropertyUpdate | PropertyInsert) => void;
  onCancel?: () => void;
  isSubmitting: boolean;
  submitButtonText?: string;
  submitButtonClassName?: string;
}

export default function PropertyForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting,
  submitButtonText = 'Save Property',
  submitButtonClassName
}: PropertyFormProps) {
  const [formData, setFormData] = useState<PropertyUpdate>({
    property_name: '',
    property_type: 'residential',
    address_line1: '',
    address_line2: '',
    city: '',
    county: '',
    postal_code: '',
    country: 'United Kingdom',
    year_built: null,
    num_bedrooms: null,
    num_bathrooms: null,
    floor_area_sqm: null,
    land_area_sqm: null,
    description: '',
    conservation_area: false,
    listed_building: false,
    listed_building_grade: null
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  const propertyTypes = [
    { value: 'residential', label: 'Residential' },
    { value: 'commercial', label: 'Commercial' },
    { value: 'mixed_use', label: 'Mixed Use' },
    { value: 'land', label: 'Land' }
  ];

  // Initialize form with data when available
  useEffect(() => {
    if (initialData) {
      setFormData({
        property_name: initialData.property_name || '',
        property_type: initialData.property_type,
        address_line1: initialData.address_line1,
        address_line2: initialData.address_line2,
        city: initialData.city,
        county: initialData.county,
        postal_code: initialData.postal_code,
        country: initialData.country,
        year_built: initialData.year_built,
        num_bedrooms: initialData.num_bedrooms,
        num_bathrooms: initialData.num_bathrooms,
        floor_area_sqm: initialData.floor_area_sqm,
        land_area_sqm: initialData.land_area_sqm,
        description: initialData.description,
        conservation_area: initialData.conservation_area,
        listed_building: initialData.listed_building,
        listed_building_grade: initialData.listed_building_grade
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      setFormData(prev => ({
        ...prev,
        [name]: target.checked
      }));
    } else if (type === 'number') {
      setFormData(prev => ({
        ...prev,
        [name]: value ? parseFloat(value) : null
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.address_line1 || !formData.address_line1.trim()) {
      newErrors.address_line1 = 'Address is required';
    }
    
    if (!formData.city || !formData.city.trim()) {
      newErrors.city = 'City is required';
    }
    
    if (!formData.postal_code || !formData.postal_code.trim()) {
      newErrors.postal_code = 'Postal code is required';
    }
    
    if (formData.year_built && (formData.year_built < 1600 || formData.year_built > new Date().getFullYear())) {
      newErrors.year_built = 'Please enter a valid year (after 1600)';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Make sure property_type is defined (required for PropertyInsert)
    const submissionData = {
      ...formData,
      property_type: formData.property_type as "residential" | "commercial" | "mixed_use" | "land"
    };
    
    onSubmit(submissionData);
  };
  
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formGroup}>
        <label htmlFor="property_name" className={styles.label}>
          Property Name
        </label>
        <input
          id="property_name"
          name="property_name"
          type="text"
          value={formData.property_name || ''}
          onChange={handleChange}
          className={styles.input}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="property_type" className={styles.label}>
          Property Type
        </label>
        <select
          id="property_type"
          name="property_type"
          value={formData.property_type}
          onChange={handleChange}
          className={styles.select}
          required
        >
          {propertyTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="address_line1" className={styles.label}>
          Address Line 1
        </label>
        <input
          id="address_line1"
          name="address_line1"
          type="text"
          value={formData.address_line1 || ''}
          onChange={handleChange}
          className={styles.input}
          required
        />
        {errors.address_line1 && (
          <p className={styles.errorText}>{errors.address_line1}</p>
        )}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="address_line2" className={styles.label}>
          Address Line 2
        </label>
        <input
          id="address_line2"
          name="address_line2"
          type="text"
          value={formData.address_line2 || ''}
          onChange={handleChange}
          className={styles.input}
        />
      </div>

      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label htmlFor="city" className={styles.label}>
            City
          </label>
          <input
            id="city"
            name="city"
            type="text"
            value={formData.city || ''}
            onChange={handleChange}
            className={styles.input}
            required
          />
          {errors.city && (
            <p className={styles.errorText}>{errors.city}</p>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="county" className={styles.label}>
            County
          </label>
          <input
            id="county"
            name="county"
            type="text"
            value={formData.county || ''}
            onChange={handleChange}
            className={styles.input}
          />
        </div>
      </div>

      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label htmlFor="postal_code" className={styles.label}>
            Postal Code
          </label>
          <input
            id="postal_code"
            name="postal_code"
            type="text"
            value={formData.postal_code || ''}
            onChange={handleChange}
            className={styles.input}
            required
          />
          {errors.postal_code && (
            <p className={styles.errorText}>{errors.postal_code}</p>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="country" className={styles.label}>
            Country
          </label>
          <input
            id="country"
            name="country"
            type="text"
            value={formData.country || ''}
            onChange={handleChange}
            className={styles.input}
          />
        </div>
      </div>

      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label htmlFor="year_built" className={styles.label}>
            Year Built
          </label>
          <input
            id="year_built"
            name="year_built"
            type="number"
            value={formData.year_built || ''}
            onChange={handleChange}
            className={styles.input}
          />
          {errors.year_built && (
            <p className={styles.errorText}>{errors.year_built}</p>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="floor_area_sqm" className={styles.label}>
            Floor Area (m²)
          </label>
          <input
            id="floor_area_sqm"
            name="floor_area_sqm"
            type="number"
            step="0.01"
            value={formData.floor_area_sqm || ''}
            onChange={handleChange}
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="land_area_sqm" className={styles.label}>
            Land Area (m²)
          </label>
          <input
            id="land_area_sqm"
            name="land_area_sqm"
            type="number"
            step="0.01"
            value={formData.land_area_sqm || ''}
            onChange={handleChange}
            className={styles.input}
          />
        </div>
      </div>

      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label htmlFor="num_bedrooms" className={styles.label}>
            Bedrooms
          </label>
          <input
            id="num_bedrooms"
            name="num_bedrooms"
            type="number"
            value={formData.num_bedrooms || ''}
            onChange={handleChange}
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="num_bathrooms" className={styles.label}>
            Bathrooms
          </label>
          <input
            id="num_bathrooms"
            name="num_bathrooms"
            type="number"
            value={formData.num_bathrooms || ''}
            onChange={handleChange}
            className={styles.input}
          />
        </div>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="description" className={styles.label}>
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          value={formData.description || ''}
          onChange={handleChange}
          className={styles.textarea}
        />
      </div>

      <div className={styles.checkboxGroup}>
        <div className={styles.checkbox}>
          <input
            id="conservation_area"
            name="conservation_area"
            type="checkbox"
            checked={formData.conservation_area || false}
            onChange={handleChange}
            className={styles.checkboxInput}
          />
          <label htmlFor="conservation_area" className={styles.checkboxLabel}>
            In Conservation Area
          </label>
        </div>

        <div className={styles.checkbox}>
          <input
            id="listed_building"
            name="listed_building"
            type="checkbox"
            checked={formData.listed_building || false}
            onChange={handleChange}
            className={styles.checkboxInput}
          />
          <label htmlFor="listed_building" className={styles.checkboxLabel}>
            Listed Building
          </label>
        </div>
      </div>

      {formData.listed_building && (
        <div className={styles.formGroup}>
          <label htmlFor="listed_building_grade" className={styles.label}>
            Listed Building Grade
          </label>
          <select
            id="listed_building_grade"
            name="listed_building_grade"
            value={formData.listed_building_grade || ''}
            onChange={handleChange}
            className={styles.select}
          >
            <option value="">Select grade</option>
            <option value="I">Grade I</option>
            <option value="II*">Grade II*</option>
            <option value="II">Grade II</option>
          </select>
        </div>
      )}

      <div className={styles.buttonGroup}>
        {onCancel && (
          <button
            type="button"
            onClick={handleCancel}
            disabled={isSubmitting}
            className={styles.cancelButton}
          >
            Cancel
          </button>
        )}
        <button 
          type="submit" 
          disabled={isSubmitting}
          className={submitButtonClassName || styles.saveButton}
        >
          {isSubmitting ? 'Saving...' : submitButtonText}
        </button>
      </div>
    </form>
  );
}
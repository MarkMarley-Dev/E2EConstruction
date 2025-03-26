import React, { useState, FormEvent } from 'react';
import { useRouter } from 'next/router';
import styles from './PropertyForm.module.css';

interface PropertyFormProps {
  initialData?: {
    id?: string;
    address?: string;
    postcode?: string;
    propertyType?: string;
    yearBuilt?: number;
    bedrooms?: number;
    bathrooms?: number;
    description?: string;
  };
  onSubmit?: (data: any) => Promise<void>;
}

const PropertyForm: React.FC<PropertyFormProps> = ({ 
  initialData = {}, 
  onSubmit 
}) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    address: initialData.address || '',
    postcode: initialData.postcode || '',
    propertyType: initialData.propertyType || 'detached',
    yearBuilt: initialData.yearBuilt || 0,
    bedrooms: initialData.bedrooms || 1,
    bathrooms: initialData.bathrooms || 1,
    description: initialData.description || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: parseInt(value, 10) || 0,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);

    try {
      // Validate required fields
      if (!formData.address || !formData.postcode) {
        throw new Error('Address and postcode are required fields');
      }

      if (onSubmit) {
        await onSubmit({
          ...formData,
          ...(initialData.id ? { id: initialData.id } : {}),
        });
      } else {
        // Default submission logic if onSubmit is not provided
        // This would connect to your Supabase service
        console.log('Submitting property data:', formData);
        // Simulating API request delay
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // Redirect to property list after successful submission
      router.push('/properties');
    } catch (error) {
      console.error('Error submitting property form:', error);
      setFormError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formHeader}>
        <h2>{initialData.id ? 'Edit Property' : 'Add New Property'}</h2>
        <p>Enter the details of your property below</p>
      </div>

      {formError && (
        <div className={styles.errorMessage}>
          {formError}
        </div>
      )}

      <div className={styles.formGroup}>
        <label htmlFor="address" className={styles.label}>Address</label>
        <input
          type="text"
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          className={styles.input}
          placeholder="Enter full property address"
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="postcode" className={styles.label}>Postcode</label>
        <input
          type="text"
          id="postcode"
          name="postcode"
          value={formData.postcode}
          onChange={handleChange}
          className={styles.input}
          placeholder="Enter postcode"
          required
        />
      </div>

      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label htmlFor="propertyType" className={styles.label}>Property Type</label>
          <select
            id="propertyType"
            name="propertyType"
            value={formData.propertyType}
            onChange={handleChange}
            className={styles.select}
          >
            <option value="detached">Detached</option>
            <option value="semi-detached">Semi-Detached</option>
            <option value="terraced">Terraced</option>
            <option value="flat">Flat/Apartment</option>
            <option value="bungalow">Bungalow</option>
            <option value="cottage">Cottage</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="yearBuilt" className={styles.label}>Year Built</label>
          <input
            type="number"
            id="yearBuilt"
            name="yearBuilt"
            value={formData.yearBuilt || ''}
            onChange={handleNumberChange}
            className={styles.input}
            placeholder="e.g. 1990"
          />
        </div>
      </div>

      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label htmlFor="bedrooms" className={styles.label}>Bedrooms</label>
          <input
            type="number"
            id="bedrooms"
            name="bedrooms"
            value={formData.bedrooms}
            onChange={handleNumberChange}
            className={styles.input}
            min="0"
            max="20"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="bathrooms" className={styles.label}>Bathrooms</label>
          <input
            type="number"
            id="bathrooms"
            name="bathrooms"
            value={formData.bathrooms}
            onChange={handleNumberChange}
            className={styles.input}
            min="0"
            max="10"
          />
        </div>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="description" className={styles.label}>Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className={styles.textarea}
          rows={4}
          placeholder="Add some details about your property..."
        />
      </div>

      <div className={styles.formActions}>
        <button 
          type="button" 
          onClick={() => router.back()} 
          className={styles.cancelButton}
        >
          Cancel
        </button>
        <button 
          type="submit" 
          className={styles.submitButton} 
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : initialData.id ? 'Update Property' : 'Add Property'}
        </button>
      </div>
    </form>
  );
};

export default PropertyForm;
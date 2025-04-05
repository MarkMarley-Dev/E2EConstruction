"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createQuickProject } from '@/lib/services/projectService';
import styles from './styles/QuickProjectStart.module.css';

const projectTypes = [
  { id: 'extension', label: 'Extension' },
  { id: 'loft_conversion', label: 'Loft Conversion' },
  { id: 'new_build', label: 'New Build' },
  { id: 'renovation', label: 'Renovation' },
  { id: 'garden_building', label: 'Garden Room / Outbuilding' },
  { id: 'interior_remodel', label: 'Interior Remodeling' },
  { id: 'other', label: 'Other Project Type' }
];

const budgetRanges = [
  { id: 'under_10k', label: 'Under £10,000' },
  { id: '10k_25k', label: '£10,000 - £25,000' },
  { id: '25k_50k', label: '£25,000 - £50,000' },
  { id: '50k_100k', label: '£50,000 - £100,000' },
  { id: '100k_250k', label: '£100,000 - £250,000' },
  { id: 'over_250k', label: 'Over £250,000' },
  { id: 'not_sure', label: 'Not sure yet' }
];

const timelineOptions = [
  { id: 'asap', label: 'As soon as possible' },
  { id: '1_3_months', label: '1-3 months' },
  { id: '3_6_months', label: '3-6 months' },
  { id: '6_12_months', label: '6-12 months' },
  { id: 'more_than_12', label: 'More than 12 months' },
  { id: 'not_sure', label: 'Not sure yet' }
];

export default function QuickProjectStart() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    project_type: '',
    description: '',
    budget_range: '',
    timeline: '',
    property: {
      address_line1: '',
      address_line2: '',
      city: '',
      postal_code: '',
      property_type: 'residential' as const
    }
  });

const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
  const { name, value } = e.target;
  
  if (name.includes('.')) {
    // Handle nested property fields
    const [parent, child] = name.split('.');
    
    if (parent === 'property') {
      setFormData({
        ...formData,
        property: {
          ...formData.property,
          [child]: value
        }
      });
    } else {
      // Handle other potential nested objects if needed
      setFormData({
        ...formData,
        [name]: value
      });
    }
  } else {
    setFormData({
      ...formData,
      [name]: value
    });
  }
};

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Generate a title if not provided
      if (!formData.title) {
        const projectType = projectTypes.find(p => p.id === formData.project_type)?.label || formData.project_type;
        formData.title = `${projectType} at ${formData.property.address_line1}`;
      }
      
      const projectId = await createQuickProject(formData);
      router.push(`/dashboard/projects/${projectId}/professionals`);
    } catch (error) {
      console.error('Error creating project:', error);
      alert('There was an error creating your project. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Start a New Project</h2>
      
      <div className={styles.stepper}>
        <div className={`${styles.step} ${step >= 1 ? styles.active : ''}`}>
          <div className={styles.stepNumber}>1</div>
          <div className={styles.stepLabel}>Project Type</div>
        </div>
        <div className={styles.stepDivider}></div>
        <div className={`${styles.step} ${step >= 2 ? styles.active : ''}`}>
          <div className={styles.stepNumber}>2</div>
          <div className={styles.stepLabel}>Property Details</div>
        </div>
        <div className={styles.stepDivider}></div>
        <div className={`${styles.step} ${step >= 3 ? styles.active : ''}`}>
          <div className={styles.stepNumber}>3</div>
          <div className={styles.stepLabel}>Additional Info</div>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        {step === 1 && (
          <div className={styles.stepContent}>
            <h3>What type of project are you planning?</h3>
            
            <div className={styles.formGroup}>
              <label htmlFor="project_type">Project Type</label>
              <select 
                id="project_type" 
                name="project_type" 
                value={formData.project_type}
                onChange={handleInputChange}
                required
                className={styles.select}
              >
                <option value="">Select project type</option>
                {projectTypes.map(type => (
                  <option key={type.id} value={type.id}>{type.label}</option>
                ))}
              </select>
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="description">Brief Description</label>
              <textarea 
                id="description" 
                name="description" 
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Please provide a brief description of your project..."
                rows={4}
                className={styles.textarea}
              />
            </div>
            
            <div className={styles.buttons}>
              <button 
                type="button" 
                onClick={nextStep} 
                disabled={!formData.project_type}
                className="button"
              >
                Continue
              </button>
            </div>
          </div>
        )}
        
        {step === 2 && (
          <div className={styles.stepContent}>
            <h3>Where is your property located?</h3>
            
            <div className={styles.formGroup}>
              <label htmlFor="property.address_line1">Address Line 1</label>
              <input 
                type="text" 
                id="property.address_line1" 
                name="property.address_line1" 
                value={formData.property.address_line1}
                onChange={handleInputChange}
                required
                className={styles.input}
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="property.address_line2">Address Line 2 (Optional)</label>
              <input 
                type="text" 
                id="property.address_line2" 
                name="property.address_line2" 
                value={formData.property.address_line2}
                onChange={handleInputChange}
                className={styles.input}
              />
            </div>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="property.city">Town/City</label>
                <input 
                  type="text" 
                  id="property.city" 
                  name="property.city" 
                  value={formData.property.city}
                  onChange={handleInputChange}
                  required
                  className={styles.input}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="property.postal_code">Postcode</label>
                <input 
                  type="text" 
                  id="property.postal_code" 
                  name="property.postal_code" 
                  value={formData.property.postal_code}
                  onChange={handleInputChange}
                  required
                  className={styles.input}
                />
              </div>
            </div>
            
            <div className={styles.buttons}>
              <button type="button" onClick={prevStep} className="button secondary">
                Back
              </button>
              <button 
                type="button" 
                onClick={nextStep} 
                disabled={!formData.property.address_line1 || !formData.property.city || !formData.property.postal_code}
                className="button"
              >
                Continue
              </button>
            </div>
          </div>
        )}
        
        {step === 3 && (
          <div className={styles.stepContent}>
            <h3>Additional Project Information</h3>
            
            <div className={styles.formGroup}>
              <label htmlFor="budget_range">Approximate Budget</label>
              <select 
                id="budget_range" 
                name="budget_range" 
                value={formData.budget_range}
                onChange={handleInputChange}
                className={styles.select}
              >
                <option value="">Select budget range</option>
                {budgetRanges.map(budget => (
                  <option key={budget.id} value={budget.id}>{budget.label}</option>
                ))}
              </select>
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="timeline">Expected Timeline</label>
              <select 
                id="timeline" 
                name="timeline" 
                value={formData.timeline}
                onChange={handleInputChange}
                className={styles.select}
              >
                <option value="">Select timeline</option>
                {timelineOptions.map(option => (
                  <option key={option.id} value={option.id}>{option.label}</option>
                ))}
              </select>
            </div>
            
            <div className={styles.buttons}>
              <button type="button" onClick={prevStep} className="button secondary">
                Back
              </button>
              <button 
                type="submit" 
                disabled={loading}
                className="button"
              >
                {loading ? 'Creating Project...' : 'Find Professionals'}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
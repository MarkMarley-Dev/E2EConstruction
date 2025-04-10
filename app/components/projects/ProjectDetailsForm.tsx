/**
 * File: app/components/projects/ProjectDetailsForm.tsx
 * Form component for editing project details in-place
 */

'use client';

import { useState, useEffect } from 'react';
import styles from './styles/ProjectDetailsForm.module.css';

// Import project type constants from your types
import { PROJECT_TYPES, BUDGET_RANGES, TIMELINES } from '@/types/supabase';

interface ProjectDetailsFormProps {
  project: any;
  onChange: (updatedDetails: any) => void;
}

export default function ProjectDetailsForm({ project, onChange }: ProjectDetailsFormProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onChange({
      [name]: value
    });
  };
  
  return (
    <div className={styles.form}>
      <div className={styles.formGroup}>
        <label htmlFor="title" className={styles.label}>Project Title</label>
        <input
          type="text"
          id="title"
          name="title"
          value={project.title || ''}
          onChange={handleChange}
          required
          className={styles.input}
        />
      </div>
      
      <div className={styles.formGroup}>
        <label htmlFor="project_type" className={styles.label}>Project Type</label>
        <select
          id="project_type"
          name="project_type"
          value={project.project_type || ''}
          onChange={handleChange}
          className={styles.select}
        >
          <option value="">Select a project type</option>
          {Object.entries(PROJECT_TYPES).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </div>
      
      <div className={styles.formGroup}>
        <label htmlFor="description" className={styles.label}>Description</label>
        <textarea
          id="description"
          name="description"
          value={project.description || ''}
          onChange={handleChange}
          rows={4}
          className={styles.textarea}
        ></textarea>
      </div>
      
      <div className={styles.formGroup}>
        <label htmlFor="budget_range" className={styles.label}>Budget Range</label>
        <select
          id="budget_range"
          name="budget_range"
          value={project.budget_range || ''}
          onChange={handleChange}
          className={styles.select}
        >
          <option value="">Select a budget range</option>
          {Object.entries(BUDGET_RANGES).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </div>
      
      <div className={styles.formGroup}>
        <label htmlFor="timeline" className={styles.label}>Expected Timeline</label>
        <select
          id="timeline"
          name="timeline"
          value={project.timeline || ''}
          onChange={handleChange}
          className={styles.select}
        >
          <option value="">Select expected timeline</option>
          {Object.entries(TIMELINES).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
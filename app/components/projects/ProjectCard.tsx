// File: app/components/projects/ProjectCard.tsx
import React from 'react';
import styles from './styles/ProjectCard.module.css';
import { PROJECT_TYPES, PROJECT_STATUSES, BUDGET_RANGES, TIMELINES } from '@/types/supabase';

interface ProjectCardProps {
  project: any;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  // Helper function to get status color class
  const getStatusClass = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'new':
        return styles.statusNew;
      case 'planning':
        return styles.statusPlanning;
      case 'in_progress':
      case 'in progress':
        return styles.statusInProgress;
      case 'completed':
        return styles.statusCompleted;
      case 'on_hold':
      case 'on hold':
        return styles.statusOnHold;
      default:
        return styles.statusNew;
    }
  };

  // Format date to be more readable
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(date);
  };

  // Format project type for display
  const formatProjectType = (type: string) => {
    if (!type) return 'Not specified';
    return PROJECT_TYPES[type as keyof typeof PROJECT_TYPES] || type.replace(/_/g, ' ');
  };

  // Format budget range for display
  const formatBudgetRange = (budgetRange: string) => {
    if (!budgetRange) return 'Not specified';
    return BUDGET_RANGES[budgetRange as keyof typeof BUDGET_RANGES] || budgetRange.replace(/_/g, ' ');
  };

  // Format timeline for display
  const formatTimeline = (timeline: string) => {
    if (!timeline) return 'Not specified';
    return TIMELINES[timeline as keyof typeof TIMELINES] || timeline.replace(/_/g, ' ');
  };

  // Format status for display
  const formatStatus = (status: string) => {
    if (!status) return 'New';
    return PROJECT_STATUSES[status as keyof typeof PROJECT_STATUSES] || status.replace(/_/g, ' ');
  };

  const propertyAddress = project.properties 
    ? `${project.properties.address_line1}${project.properties.address_line2 ? ', ' + project.properties.address_line2 : ''}, ${project.properties.city}, ${project.properties.postal_code}`
    : 'No property attached';

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>{project.title || 'Untitled Project'}</h3>
        <span className={`${styles.status} ${getStatusClass(project.status || 'new')}`}>
          {formatStatus(project.status)}
        </span>
      </div>
      
      <div className={styles.details}>
        <div className={styles.detailItem}>
          <span className={styles.detailLabel}>Type:</span>
          <span className={styles.detailValue}>
            {formatProjectType(project.project_type)}
          </span>
        </div>
        
        <div className={styles.detailItem}>
          <span className={styles.detailLabel}>Property:</span>
          <span className={styles.detailValue}>{propertyAddress}</span>
        </div>
        
        <div className={styles.detailItem}>
          <span className={styles.detailLabel}>Budget:</span>
          <span className={styles.detailValue}>{formatBudgetRange(project.budget_range)}</span>
        </div>
        
        <div className={styles.detailItem}>
          <span className={styles.detailLabel}>Timeline:</span>
          <span className={styles.detailValue}>{formatTimeline(project.timeline)}</span>
        </div>
        
        <div className={styles.detailItem}>
          <span className={styles.detailLabel}>Created:</span>
          <span className={styles.detailValue}>{formatDate(project.created_at)}</span>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
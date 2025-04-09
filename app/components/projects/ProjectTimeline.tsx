/**
 * File: app/components/projects/ProjectTimeline.tsx
 * Project Timeline Component
 */

'use client';

import { useState, useEffect } from 'react';
import styles from './styles/ProjectTimeline.module.css';

interface ProjectTimelineProps {
  projectId: string;
  currentStage: string;
  stages: Record<string, string>;
}

interface Milestone {
  stage: string;
  label: string;
  date?: Date;
  completed: boolean;
  active: boolean;
}

export default function ProjectTimeline({ projectId, currentStage, stages }: ProjectTimelineProps) {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTimelineData = async () => {
      try {
        // In a real implementation, you would fetch actual timeline data from your API
        // For now, we'll generate sample data based on the project stages
        
        const stageKeys = Object.keys(stages);
        const currentStageIndex = stageKeys.indexOf(currentStage);
        
        const generatedMilestones = stageKeys.map((stage, index) => {
          // Create a sample date (for demonstration purposes)
          const today = new Date();
          const date = index < currentStageIndex 
            ? new Date(today.setDate(today.getDate() - (currentStageIndex - index) * 14)) 
            : index === currentStageIndex
              ? today
              : new Date(today.setDate(today.getDate() + (index - currentStageIndex) * 14));
          
          return {
            stage,
            label: stages[stage],
            date: index <= currentStageIndex ? date : undefined,
            completed: index < currentStageIndex,
            active: index === currentStageIndex
          };
        });
        
        setMilestones(generatedMilestones);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching timeline data:', error);
        setLoading(false);
      }
    };

    fetchTimelineData();
  }, [projectId, currentStage, stages]);

  if (loading) {
    return <div className={styles.loading}>Loading timeline...</div>;
  }

  return (
    <div className={styles.timelineContainer}>
      <div className={styles.timeline}>
        {milestones.map((milestone, index) => (
          <div 
            key={milestone.stage} 
            className={`${styles.milestone} ${milestone.completed ? styles.completed : ''} ${milestone.active ? styles.active : ''}`}
          >
            <div className={styles.milestoneContent}>
              <div className={styles.milestonePoint}>
                {milestone.completed ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                ) : (
                  <span></span>
                )}
              </div>
              {index < milestones.length - 1 && (
                <div className={`${styles.milestoneLine} ${milestone.completed ? styles.completedLine : ''}`}></div>
              )}
            </div>
            <div className={styles.milestoneDetails}>
              <h3 className={styles.milestoneLabel}>{milestone.label}</h3>
              {milestone.date && (
                <p className={styles.milestoneDate}>
                  {milestone.date.toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className={styles.timelineActions}>
        <button className="button secondary">View Detailed Timeline</button>
      </div>
    </div>
  );
}
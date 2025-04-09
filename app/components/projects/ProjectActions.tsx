/**
 * File: app/components/projects/ProjectActions.tsx
 * Project Actions Component - Shows available actions based on project stage and user role
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './styles/ProjectActions.module.css';

interface ProjectActionsProps {
  projectId: string;
  currentStage: string;
  userRole: string;
}

export default function ProjectActions({ projectId, currentStage, userRole }: ProjectActionsProps) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState<string | null>(null);

  // Helper to determine which actions are available based on stage and role
  const getAvailableActions = () => {
    const actions: { id: string; label: string; href?: string; action?: () => void; primary?: boolean }[] = [];
    
    // Common actions for all stages
    actions.push({
      id: 'message',
      label: 'Send Message',
      href: `/dashboard/messages?project=${projectId}`,
    });
    
    // Stage-specific actions
    switch (currentStage) {
      case 'initial':
        if (userRole === 'homeowner') {
          actions.push({
            id: 'request_assessment',
            label: 'Request Planning Assessment',
            action: () => openModal('request_assessment'),
            primary: true,
          });
        }
        break;
        
      case 'planning_assessment':
        if (userRole === 'homeowner') {
          actions.push({
            id: 'view_assessment',
            label: 'View Assessment Progress',
            href: `/dashboard/projects/${projectId}/assessment`,
          });
        } else if (userRole === 'architect' || userRole === 'surveyor') {
          actions.push({
            id: 'update_assessment',
            label: 'Update Assessment',
            href: `/dashboard/projects/${projectId}/assessment/edit`,
            primary: true,
          });
        }
        break;
        
      case 'planning_application':
        actions.push({
          id: 'view_application',
          label: 'View Planning Application',
          href: `/dashboard/projects/${projectId}/planning`,
        });
        
        if (userRole === 'architect' || userRole === 'surveyor') {
          actions.push({
            id: 'update_application',
            label: 'Update Application',
            href: `/dashboard/projects/${projectId}/planning/edit`,
            primary: true,
          });
        }
        break;
        
      case 'party_wall':
        actions.push({
          id: 'view_party_wall',
          label: 'View Party Wall Notices',
          href: `/dashboard/projects/${projectId}/party-wall`,
        });
        
        if (userRole === 'surveyor') {
          actions.push({
            id: 'manage_party_wall',
            label: 'Manage Party Wall Process',
            href: `/dashboard/projects/${projectId}/party-wall/manage`,
            primary: true,
          });
        }
        break;
        
      case 'contractor_selection':
        if (userRole === 'homeowner') {
          actions.push({
            id: 'view_bids',
            label: 'View Contractor Bids',
            href: `/dashboard/projects/${projectId}/bids`,
            primary: true,
          });
        } else if (userRole === 'contractor') {
          actions.push({
            id: 'submit_bid',
            label: 'Submit Bid',
            action: () => openModal('submit_bid'),
            primary: true,
          });
        }
        break;
        
      case 'construction':
        actions.push({
          id: 'track_progress',
          label: 'Track Construction Progress',
          href: `/dashboard/projects/${projectId}/construction`,
          primary: true,
        });
        
        if (userRole === 'contractor') {
          actions.push({
            id: 'update_progress',
            label: 'Update Progress',
            action: () => openModal('update_progress'),
          });
        }
        break;
        
      case 'completion':
        if (userRole === 'homeowner') {
          actions.push({
            id: 'leave_review',
            label: 'Leave Review',
            action: () => openModal('leave_review'),
          });
        }
        break;
        
      default:
        // No specific actions for unknown stages
        break;
    }
    
    // Add document upload action for all users and stages
    actions.push({
      id: 'upload_document',
      label: 'Upload Document',
      action: () => openModal('upload_document'),
    });
    
    return actions;
  };

  const openModal = (action: string) => {
    setModalAction(action);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalAction(null);
  };

  const handleAction = async () => {
    // Implementation for each action would go here
    // This is a placeholder for now
    console.log(`Handling action: ${modalAction}`);
    
    // Mock implementation for demonstration
    setTimeout(() => {
      closeModal();
      router.refresh(); // Refresh the page data
    }, 1000);
  };

  const availableActions = getAvailableActions();

  return (
    <div className={styles.actionsContainer}>
      <div className={styles.actionsList}>
        {availableActions.map((action) => (
          action.href ? (
            <Link 
              key={action.id}
              href={action.href}
              className={`${styles.actionButton} ${action.primary ? 'button' : 'button secondary'}`}
            >
              {action.label}
            </Link>
          ) : (
            <button
              key={action.id}
              onClick={action.action}
              className={`${styles.actionButton} ${action.primary ? 'button' : 'button secondary'}`}
            >
              {action.label}
            </button>
          )
        ))}
      </div>
      
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3 className={styles.modalTitle}>
              {modalAction === 'request_assessment' && 'Request Planning Assessment'}
              {modalAction === 'submit_bid' && 'Submit Contractor Bid'}
              {modalAction === 'update_progress' && 'Update Construction Progress'}
              {modalAction === 'leave_review' && 'Leave a Review'}
              {modalAction === 'upload_document' && 'Upload Project Document'}
            </h3>
            
            <div className={styles.modalContent}>
              <p>This functionality will be implemented in the next phase.</p>
            </div>
            
            <div className={styles.modalActions}>
              <button onClick={closeModal} className="button secondary">
                Cancel
              </button>
              <button onClick={handleAction} className="button">
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
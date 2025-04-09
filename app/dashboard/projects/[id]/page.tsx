/**
 * File: app/dashboard/projects/[id]/page.tsx
 * Project Details Page Component
 */

import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ProjectTimeline from '@/components/projects/ProjectTimeline';
import ProjectActions from '@/components/projects/ProjectActions';
import ProjectProperty from '@/components/projects/ProjectProperty';
import ProjectTeam from '@/components/projects/ProjectTeam';
import styles from './styles/ProjectDetails.module.css';
import { createServerSupabaseClient } from '@/lib/supabase/server';

// Define project stages for timeline visualization
const PROJECT_STAGES = {
  'initial': 'Project Initiation',
  'planning_assessment': 'Planning Assessment',
  'planning_application': 'Planning Application',
  'party_wall': 'Party Wall',
  'contractor_selection': 'Contractor Selection',
  'construction': 'Construction',
  'completion': 'Completion'
};

export default async function ProjectDetailsPage({ params }: { params: { id: string } }) {
  const supabase = createServerSupabaseClient();
  
  // Get authenticated user
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return notFound();
  }
  
  const userId = session.user.id;
  
  try {
    // Get project details - update this to match your implementation
    const { data: projectData, error: projectError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', params.id)
      .single();
    
    if (projectError || !projectData) {
      console.error("Error fetching project:", projectError);
      return notFound();
    }

    const project = projectData;
    
    // Get property details from the project's property_id
    let property = null;
    if (project.property_id) {
      const { data: propertyData, error: propertyError } = await supabase
        .from('properties')
        .select('*')
        .eq('id', project.property_id)
        .single();
        
      if (!propertyError) {
        property = propertyData;
      }
    }
    
    // Determine current project stage
    const currentStage = project.status || 'initial';
    
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.titleContainer}>
            <h1 className={styles.title}>{project.title}</h1>
            <span className={`${styles.status} status status-${getStatusClass(currentStage)}`}>
              {PROJECT_STAGES[currentStage as keyof typeof PROJECT_STAGES] || 'Unknown Stage'}
            </span>
          </div>
          <div className={styles.actions}>
  {session.user.user_metadata.role !== 'homeowner' && (
    <Link href={`/dashboard/projects/${params.id}/edit`} className="button secondary">
      Edit Project
    </Link>
  )}
</div>
        </div>
        
        <div className={styles.content}>
          <div className={styles.mainContent}>
            <section className={`${styles.section} card`}>
              <h2 className={styles.sectionTitle}>Project Details</h2>
              <div className={styles.projectInfo}>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Project Type:</span>
                  <span className={styles.infoValue}>{project.project_type || 'Not specified'}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Description:</span>
                  <p className={styles.infoValue}>{project.description || 'No description provided'}</p>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Budget:</span>
                  <span className={styles.infoValue}>
                    {project.budget_range || 'Not specified'}
                  </span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Created:</span>
                  <span className={styles.infoValue}>
                    {project.created_at ? new Date(project.created_at).toLocaleDateString() : 'Unknown'}
                  </span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Timeline:</span>
                  <span className={styles.infoValue}>
                    {project.timeline || 'Not specified'}
                  </span>
                </div>
              </div>
            </section>
            
            <Suspense fallback={<LoadingSpinner />}>
              <section className={`${styles.section} card`}>
                <h2 className={styles.sectionTitle}>Project Timeline - link to planning api + manual possibilities?</h2>
                <ProjectTimeline 
                  projectId={params.id} 
                  currentStage={currentStage} 
                  stages={PROJECT_STAGES} 
                />
              </section>
            </Suspense>
            
            <Suspense fallback={<LoadingSpinner />}>
              <section className={`${styles.section} card`}>
                <h2 className={styles.sectionTitle}>Documents</h2>
                <div className={styles.documentsPlaceholder}>
                  <p>Project documents will be displayed here.</p>
                  <p>This feature will be implemented in the next phase.</p>
                </div>
              </section>
            </Suspense>
          </div>
          
          <div className={styles.sidebar}>
            <Suspense fallback={<LoadingSpinner />}>
              <section className={`${styles.sidebarSection} card`}>
                <h2 className={styles.sectionTitle}>Property</h2>
                <ProjectProperty property={property} />
              </section>
            </Suspense>
            
            <Suspense fallback={<LoadingSpinner />}>
              <section className={`${styles.sidebarSection} card`}>
                <h2 className={styles.sectionTitle}>Project Team</h2>
                <ProjectTeam />
              </section>
            </Suspense>
            
            <Suspense fallback={<LoadingSpinner />}>
              <section className={`${styles.sidebarSection} card`}>
                <h2 className={styles.sectionTitle}>Actions</h2>
                <ProjectActions 
                  projectId={params.id} 
                  currentStage={currentStage}
                  userRole={session.user.user_metadata.role || 'homeowner'}
                />
              </section>
            </Suspense>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error loading project details:', error);
    return (
      <div className={styles.errorContainer}>
        <h1>Error Loading Project</h1>
        <p>There was an error loading the project details. Please try again later.</p>
        <Link href="/dashboard/projects" className="button">
          Back to Projects
        </Link>
      </div>
    );
  }
}

// Helper function to map project status to UI status class
function getStatusClass(status: string): string {
  const statusMap: Record<string, string> = {
    'initial': 'warning',
    'planning_assessment': 'warning',
    'planning_application': 'warning',
    'party_wall': 'warning',
    'contractor_selection': 'warning',
    'construction': 'warning',
    'completion': 'success',
    'on_hold': 'error',
    'cancelled': 'error'
  };
  
  return statusMap[status] || 'warning';
}
/**
 * File: app/dashboard/projects/[id]/page.tsx
 * Project Details Page Component with Improved Layout
 */

'use client';

import { notFound, useRouter } from 'next/navigation';
import { Suspense, useState, useEffect, use } from 'react';
import Link from 'next/link';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ProjectTimeline from '@/components/projects/ProjectTimeline';
import ProjectActions from '@/components/projects/ProjectActions';
import ProjectProperty from '@/components/projects/ProjectProperty';
import ProjectTeam from '@/components/projects/ProjectTeam';
import ProjectDetailsForm from '@/components/projects/ProjectDetailsForm';
import styles from './styles/ProjectDetails.module.css';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

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

export default function ProjectDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params); // Unwrap the params Promise
  const projectId = resolvedParams.id;
  
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [project, setProject] = useState<any>(null);
  const [property, setProperty] = useState<any>(null);
  
  // Single edit mode toggle for the entire page
  const [isEditing, setIsEditing] = useState(false);
  
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        
        // Get authenticated user
        const { data: sessionData } = await supabase.auth.getSession();
        if (!sessionData.session) {
          router.push('/auth/login');
          return;
        }
        
        setSession(sessionData.session);
        
        // Get project details
        const { data: projectData, error: projectError } = await supabase
          .from('projects')
          .select('*')
          .eq('id', projectId)
          .single();
        
        if (projectError || !projectData) {
          console.error("Error fetching project:", projectError);
          throw new Error(projectError?.message || "Project not found");
        }

        setProject(projectData);
        
        // Get property details from the project's property_id
        if (projectData.property_id) {
          const { data: propertyData, error: propertyError } = await supabase
            .from('properties')
            .select('*')
            .eq('id', projectData.property_id)
            .single();
            
          if (!propertyError && propertyData) {
            setProperty(propertyData);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
        console.error('Error loading project details:', err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, [projectId, router, supabase]);

const handleSaveProject = async (updatedDetails: any) => {
  try {
    console.log('Saving project with updates:', updatedDetails);
    
    // 1. Save project details
    const { error: projectError } = await supabase
      .from('projects')
      .update(updatedDetails)
      .eq('id', projectId);
      
    if (projectError) {
      console.error('Error updating project:', projectError);
      throw projectError;
    }
    
    console.log('Project details saved successfully');
    
    // 2. Save property changes if any were made
    if (property && property.id) {
      console.log('Attempting to save property changes:', property);
      
      // Create a property update object with the correct column names
      const propertyUpdate = {
        property_name: property.property_name,
        property_type: property.property_type,
        address_line1: property.address_line1,
        address_line2: property.address_line2,
        city: property.city,
        county: property.county,
        postal_code: property.postal_code,
        country: property.country || 'United Kingdom', // Default value
        
        // Map UI property fields to database column names
        year_built: property.construction_year, // Map from UI field to DB field
        floor_area_sqm: property.area_sqm, // Map from UI field to DB field
        num_bedrooms: property.bedrooms, // Map from UI field to DB field
        num_bathrooms: property.bathrooms, // Map from UI field to DB field
        
        description: property.description,
        // Exclude fields that might not be updated or aren't submitted from the form
      };
      
      const { error: propertyError } = await supabase
        .from('properties')
        .update(propertyUpdate)
        .eq('id', property.id);
        
      if (propertyError) {
        console.error('Error updating property:', propertyError);
        throw propertyError;
      }
      
      console.log('Property details saved successfully');
    }
    
    // Update local state
    setProject({
      ...project,
      ...updatedDetails
    });
    
    // Exit edit mode
    setIsEditing(false);
  } catch (error) {
    console.error('Error updating details:', error);
    alert('Failed to save changes. Please try again.');
  }
};
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (error || !project) {
    return (
      <div className={styles.errorContainer}>
        <h1>Error Loading Project</h1>
        <p>{error || 'Project not found'}</p>
        <Link href="/dashboard/projects" className="button">
          Back to Projects
        </Link>
      </div>
    );
  }
  
  // Determine current project stage
  const currentStage = project.status || 'initial';
  
  const isEditable = session?.user?.user_metadata?.role !== 'homeowner';
  
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
          {isEditable && (
            <>
              {isEditing ? (
                <div className={styles.editActions}>
                  <button 
                    onClick={() => setIsEditing(false)} 
                    className="button secondary"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => handleSaveProject(project)} 
                    className="button"
                  >
                    Save Changes
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setIsEditing(true)} 
                  className="button secondary"
                >
                  Edit Project
                </button>
              )}
            </>
          )}
        </div>
      </div>
      
      <div className={styles.content}>
        <div className={styles.mainContent}>
          <section className={`${styles.section} card`}>
            <h2 className={styles.sectionTitle}>Project Details</h2>
            
            {isEditing ? (
              <ProjectDetailsForm 
                project={project}
                onChange={(updatedDetails) => {
                  setProject({...project, ...updatedDetails});
                }}
              />
            ) : (
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
            )}
          </section>
          
          <Suspense fallback={<LoadingSpinner />}>
            <section className={`${styles.section} card`}>
              <h2 className={styles.sectionTitle}>Property Info</h2>
              <ProjectProperty 
                property={property} 
                isEditing={isEditing}
                onChange={isEditing ? (updatedProperty) => {
                  // Handle property updates
                  setProperty({...property, ...updatedProperty});
                } : undefined}
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
              <h2 className={styles.sectionTitle}>Project Timeline</h2>
              <ProjectTimeline 
                projectId={projectId} 
                currentStage={currentStage} 
                stages={PROJECT_STAGES} 
              />
            </section>
          </Suspense>
          
          <Suspense fallback={<LoadingSpinner />}>
            <section className={`${styles.sidebarSection} card`}>
              <h2 className={styles.sectionTitle}>Project Team</h2>
              <ProjectTeam 
                isEditing={isEditing} 
              />
            </section>
          </Suspense>
          
          <Suspense fallback={<LoadingSpinner />}>
            <section className={`${styles.sidebarSection} card`}>
              <h2 className={styles.sectionTitle}>Actions</h2>
              <ProjectActions 
                projectId={projectId} 
                currentStage={currentStage}
                userRole={session.user.user_metadata.role || 'homeowner'}
              />
            </section>
          </Suspense>
        </div>
      </div>
      
      {/* Fixed save bar that appears when in edit mode */}
      {isEditing && (
        <div className={styles.saveBar}>
          <div className={styles.saveBarContent}>
            <button 
              onClick={() => setIsEditing(false)} 
              className="button secondary"
            >
              Cancel
            </button>
            <button 
              onClick={() => handleSaveProject(project)} 
              className="button"
            >
              Save All Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
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
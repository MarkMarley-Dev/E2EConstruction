/**
 * File: app/dashboard/projects/[id]/professionals/page.tsx
 * Updated to add debugging for missing professionals
 */
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import ProfessionalCard from '@/components/professionals/ProfessionalCard';
import styles from './styles/ProjectProfessionals.module.css';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { mapProfileToProfessional, Professional } from '@/types/supabase';

export default function ProjectProfessionalsPage() {
  const params = useParams();
  const projectId = params.id as string;
  const supabase = createClientComponentClient();
  
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [allProfiles, setAllProfiles] = useState<any[]>([]); // For debugging
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [invitedProfessionals, setInvitedProfessionals] = useState<string[]>([]);
  const [roleFilter, setRoleFilter] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>('');

  useEffect(() => {
    async function fetchProfessionals() {
      try {
        setLoading(true);
        
        // Fetch project to ensure it exists
        const { data: project, error: projectError } = await supabase
          .from('projects')
          .select('*')
          .eq('id', projectId)
          .single();
          
        if (projectError) {
          throw new Error(`Project not found: ${projectError.message}`);
        }
        
        // DEBUG: First fetch ALL profiles to see what's in the database
        const { data: allProfilesData, error: allProfilesError } = await supabase
          .from('profiles')
          .select('*');
          
        if (allProfilesError) {
          setDebugInfo(`Error fetching all profiles: ${allProfilesError.message}`);
        } else {
          setAllProfiles(allProfilesData || []);
          setDebugInfo(`Found ${allProfilesData?.length || 0} total profiles`);
          
          // Check what roles exist in the database
          const roles = [...new Set(allProfilesData?.map(p => p.role) || [])];
          setDebugInfo(prev => `${prev}
Roles found in database: ${JSON.stringify(roles)}`);
        }
        
        // Now fetch professionals with specific roles
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .in('role', ['architect', 'surveyor', 'contractor']);
          
        if (error) {
          throw new Error(`Failed to load professionals: ${error.message}`);
        }
        
        setDebugInfo(prev => `${prev}
Filtered professionals count: ${data?.length || 0}`);
        
        const mappedProfessionals = data?.map(profile => mapProfileToProfessional(profile)) || [];
        setProfessionals(mappedProfessionals);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    
    if (projectId) {
      fetchProfessionals();
    }
  }, [projectId, supabase]);

  // Check for existing invitations when component loads
  useEffect(() => {
    const checkExistingInvitations = async () => {
      if (!projectId) return;
      
      const { data, error } = await supabase
        .from('project_professionals')
        .select('professional_id')
        .eq('project_id', projectId);
        
      if (error) {
        console.error('Error checking existing invitations:', error);
        return;
      }
      
      if (data && data.length > 0) {
        const invitedIds = data.map(item => item.professional_id);
        setInvitedProfessionals(invitedIds);
      }
    };
    
    checkExistingInvitations();
  }, [projectId, supabase]);

  // Handle invitation function
  const inviteProfessional = async (professionalId: string) => {
    try {
      // Insert into project_professionals with all required fields
      const { data, error } = await supabase
        .from('project_professionals')
        .insert({
          project_id: projectId,
          professional_id: professionalId,
          status: 'invited',
          role: 'consultant', // Required field based on your schema
          created_at: new Date()
        });
        
      if (error) {
        throw new Error(`Failed to invite professional: ${error.message}`);
      }
      
      // Update local state
      setInvitedProfessionals(prev => [...prev, professionalId]);
      
      alert('Professional invited successfully!');
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : 'Failed to invite professional');
    }
  };

  // Filter professionals by role
  const filteredProfessionals = roleFilter 
    ? professionals.filter(prof => prof.role === roleFilter)
    : professionals;

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Find Professionals for Your Project</h1>
        
        <div className={styles.filters}>
          <button 
            onClick={() => setRoleFilter(null)}
            className={`${styles.filterButton} ${roleFilter === null ? styles.activeFilter : ''}`}
          >
            All
          </button>
          <button 
            onClick={() => setRoleFilter('architect')}
            className={`${styles.filterButton} ${roleFilter === 'architect' ? styles.activeFilter : ''}`}
          >
            Architects
          </button>
          <button 
            onClick={() => setRoleFilter('surveyor')}
            className={`${styles.filterButton} ${roleFilter === 'surveyor' ? styles.activeFilter : ''}`}
          >
            Surveyors
          </button>
          <button 
            onClick={() => setRoleFilter('contractor')}
            className={`${styles.filterButton} ${roleFilter === 'contractor' ? styles.activeFilter : ''}`}
          >
            Contractors
          </button>
        </div>
      </div>
      
      {/* Debugging Information */}
      {debugInfo && (
        <div style={{ 
          background: '#f0f0f0', 
          padding: '10px', 
          marginBottom: '20px',
          borderRadius: '4px',
          fontFamily: 'monospace',
          whiteSpace: 'pre-wrap'
        }}>
          <details>
            <summary>Debug Information (Click to expand)</summary>
            <div>{debugInfo}</div>
            <div>All Profiles: 
              <pre>{JSON.stringify(allProfiles.slice(0, 3), null, 2)}</pre>
              {allProfiles.length > 3 && <p>...and {allProfiles.length - 3} more</p>}
            </div>
          </details>
        </div>
      )}
      
      {filteredProfessionals.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyStateIcon}>🔍</div>
          <p>No professionals found matching your criteria.</p>
          {allProfiles.length > 0 && (
            <p>Try adding profiles with role set to 'architect', 'surveyor', or 'contractor'.</p>
          )}
        </div>
      ) : (
        <div className={styles.professionalsList}>
          {filteredProfessionals.map((professional) => (
            <ProfessionalCard
              key={professional.id}
              professional={professional}
              onInvite={inviteProfessional}
              alreadyInvited={invitedProfessionals.includes(professional.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
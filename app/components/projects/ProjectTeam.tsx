/**
 * File: app/components/projects/ProjectTeam.tsx
 * Project Team Component for displaying professionals on a project
 */
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import styles from './styles/ProjectTeam.module.css';

interface Professional {
  id: string;
  name: string;
  role: string;
  company?: string;
  specialization?: string;
  rating?: number;
  avatar_url?: string;
  verified: boolean;
  status?: string; // Add status property
  project_role?: string; // Add project_role property
}

export default function ProjectTeam() {
  const params = useParams();
  const projectId = params?.id as string;
  const supabase = createClientComponentClient();
  
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProjectTeam() {
      try {
        setLoading(true);
        
        // Fetch project professionals (those already associated with the project)
        const { data: projectProfessionals, error: projectProfessionalsError } = await supabase
          .from('project_professionals')
          .select(`
            professional_id,
            status,
            role,
            profiles!professional_id(
              id,
              full_name,
              role,
              company,
              specialization,
              rating,
              avatar_url,
              verified
            )
          `)
          .eq('project_id', projectId);
          
        if (projectProfessionalsError) {
          throw new Error(`Failed to load project team: ${projectProfessionalsError.message}`);
        }
        
        if (!projectProfessionals || projectProfessionals.length === 0) {
          setProfessionals([]);
          setLoading(false);
          return;
        }
        
        // Map to the expected Professional format
        const teamMembers = projectProfessionals.map(item => {
          const profile = item.profiles as any;
          return {
            id: profile.id,
            name: profile.full_name,
            role: profile.role,
            company: profile.company,
            specialization: profile.specialization,
            rating: profile.rating,
            avatar_url: profile.avatar_url,
            verified: profile.verified || false,
            status: item.status,
            project_role: item.role
          };
        });
        
        setProfessionals(teamMembers);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    
    if (projectId) {
      fetchProjectTeam();
    }
  }, [projectId, supabase]);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {professionals.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No professionals assigned to this project yet.</p>
          <Link 
            href={`/dashboard/projects/${projectId}/professionals`} 
            className="button"
          >
            Find Professionals
          </Link>
        </div>
      ) : (
        <>
          <div className={styles.teamList}>
            {professionals.map((professional) => (
              <div key={professional.id} className={styles.teamMember}>
                <div className={styles.memberAvatar}>
                  {professional.avatar_url ? (
                    <img 
                      src={professional.avatar_url} 
                      alt={professional.name} 
                      className={styles.avatarImage}
                    />
                  ) : (
                    <div className={styles.avatarPlaceholder}>
                      {professional.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className={styles.memberInfo}>
                  <h3 className={styles.memberName}>{professional.name}</h3>
                  <div className={styles.memberRole}>
                    <span 
                      className={styles.roleLabel}
                      style={{ 
                        backgroundColor: 
                          professional.role === 'architect' ? 'var(--color-primary-light)' :
                          professional.role === 'surveyor' ? 'var(--color-secondary-light)' :
                          professional.role === 'contractor' ? 'var(--color-accent-light)' :
                          'var(--color-gray-400)'
                      }}
                    >
                      {professional.role}
                    </span>
                    {professional.project_role && (
                      <span className={styles.projectRole}>
                        {professional.project_role}
                      </span>
                    )}
                  </div>
                  {professional.status && (
                    <div className={styles.memberStatus}>
                      Status: <span className={styles.statusValue}>{professional.status}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className={styles.teamActions}>
            <Link 
              href={`/dashboard/projects/${projectId}/professionals`} 
              className="button secondary"
            >
              Manage Team
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
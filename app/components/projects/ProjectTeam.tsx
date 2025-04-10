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
  status?: string;
  project_role?: string;
}

interface ProjectTeamProps {
  isEditing?: boolean;
}

export default function ProjectTeam({ isEditing = false }: ProjectTeamProps) {
  const params = useParams();
  const projectId = params?.id as string;
  const supabase = createClientComponentClient();
  
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [availableProfessionals, setAvailableProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

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
        } else {
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
        }

        // If in editing mode, fetch available professionals that can be added
        if (isEditing) {
          const { data: availableProfs, error: availableError } = await supabase
            .from('profiles')
            .select(`
              id,
              full_name,
              role,
              company,
              specialization,
              rating,
              avatar_url,
              verified
            `)
            .in('role', ['architect', 'surveyor', 'contractor'])
            .not('id', 'in', projectProfessionals ? projectProfessionals.map(p => p.professional_id) : [])
            .limit(10);

          if (!availableError && availableProfs) {
            const mappedAvailable = availableProfs.map(prof => ({
              id: prof.id,
              name: prof.full_name,
              role: prof.role,
              company: prof.company,
              specialization: prof.specialization,
              rating: prof.rating,
              avatar_url: prof.avatar_url,
              verified: prof.verified || false
            }));
            setAvailableProfessionals(mappedAvailable);
          }
        }
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
  }, [projectId, supabase, isEditing]);

  const handleAddProfessional = async (professional: Professional) => {
    try {
      // Add professional to project
      const { error } = await supabase
        .from('project_professionals')
        .insert({
          project_id: projectId,
          professional_id: professional.id,
          role: professional.role, // Default to their general role
          status: 'invited'
        });

      if (error) throw error;

      // Add to the local state
      setProfessionals([...professionals, {
        ...professional,
        status: 'invited',
        project_role: professional.role
      }]);

      // Remove from available professionals
      setAvailableProfessionals(availableProfessionals.filter(p => p.id !== professional.id));
    } catch (error) {
      console.error('Error adding professional:', error);
      alert('Failed to add professional. Please try again.');
    }
  };

  const handleRemoveProfessional = async (professionalId: string) => {
    try {
      // Remove professional from project
      const { error } = await supabase
        .from('project_professionals')
        .delete()
        .eq('project_id', projectId)
        .eq('professional_id', professionalId);

      if (error) throw error;

      // Get the professional data before removing from local state
      const professionalToRemove = professionals.find(p => p.id === professionalId);
      
      // Update local state
      setProfessionals(professionals.filter(p => p.id !== professionalId));

      // Add back to available professionals if they exist
      if (professionalToRemove) {
        setAvailableProfessionals([...availableProfessionals, {
          ...professionalToRemove,
          status: undefined,
          project_role: undefined
        }]);
      }
    } catch (error) {
      console.error('Error removing professional:', error);
      alert('Failed to remove professional. Please try again.');
    }
  };

  const handleChangeRole = async (professionalId: string, newRole: string) => {
    try {
      // Update professional's role in project
      const { error } = await supabase
        .from('project_professionals')
        .update({ role: newRole })
        .eq('project_id', projectId)
        .eq('professional_id', professionalId);

      if (error) throw error;

      // Update local state
      setProfessionals(professionals.map(p => 
        p.id === professionalId ? { ...p, project_role: newRole } : p
      ));
    } catch (error) {
      console.error('Error updating professional role:', error);
      alert('Failed to update role. Please try again.');
    }
  };

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
      {professionals.length === 0 && !isEditing ? (
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
                    {isEditing ? (
                      <select
                        value={professional.project_role || professional.role}
                        onChange={(e) => handleChangeRole(professional.id, e.target.value)}
                        className={styles.roleSelect}
                      >
                        <option value="lead_architect">Lead Architect</option>
                        <option value="assistant_architect">Assistant Architect</option>
                        <option value="lead_surveyor">Lead Surveyor</option>
                        <option value="structural_engineer">Structural Engineer</option>
                        <option value="general_contractor">General Contractor</option>
                        <option value="specialist_contractor">Specialist Contractor</option>
                        <option value="consultant">Consultant</option>
                      </select>
                    ) : professional.project_role && (
                      <span className={styles.projectRole}>
                        {professional.project_role.replace(/_/g, ' ')}
                      </span>
                    )}
                  </div>
                  {professional.status && (
                    <div className={styles.memberStatus}>
                      Status: <span className={styles.statusValue}>{professional.status}</span>
                    </div>
                  )}
                  {isEditing && (
                    <button 
                      onClick={() => handleRemoveProfessional(professional.id)}
                      className={`${styles.removeButton} button small`}
                      type="button"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {isEditing && (
            <div className={styles.addProfessionals}>
              <h4 className={styles.addTitle}>Add Team Members</h4>
              <div className={styles.searchContainer}>
                <input
                  type="text"
                  placeholder="Search for professionals..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={styles.searchInput}
                />
              </div>
              <div className={styles.availableProfessionals}>
                {availableProfessionals.length > 0 ? (
                  availableProfessionals
                    .filter(p => 
                      searchQuery === '' || 
                      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      p.role.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map(professional => (
                      <div key={professional.id} className={styles.availableProfessional}>
                        <div className={styles.professionalInfo}>
                          <div className={styles.memberAvatar}>
                            {professional.avatar_url ? (
                              <img 
                                src={professional.avatar_url} 
                                alt={professional.name} 
                                className={styles.avatarImageSmall}
                              />
                            ) : (
                              <div className={styles.avatarPlaceholderSmall}>
                                {professional.name.charAt(0)}
                              </div>
                            )}
                          </div>
                          <div>
                            <span className={styles.availableName}>{professional.name}</span>
                            <span 
                              className={styles.availableRole}
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
                          </div>
                        </div>
                        <button 
                          onClick={() => handleAddProfessional(professional)}
                          className={`${styles.addButton} button small secondary`}
                          type="button"
                        >
                          Add
                        </button>
                      </div>
                    ))
                ) : (
                  <p className={styles.noResults}>No available professionals found.</p>
                )}
              </div>
            </div>
          )}
          
          {!isEditing && (
            <div className={styles.teamActions}>
              <Link 
                href={`/dashboard/projects/${projectId}/professionals`} 
                className="button secondary"
              >
                Manage Team
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
}
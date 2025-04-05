/**
 * File: app/components/professionals/ProfessionalCard.tsx
 * Professional Card Component for displaying professional information
 */
import React from 'react';
import styles from './styles/ProfessionalCard.module.css';
import { Professional } from '@/types/supabase'; // Import from supabase.ts

interface ProfessionalCardProps {
  professional: Professional;
  onInvite?: (id: string) => void;
  alreadyInvited?: boolean;
}

const ProfessionalCard: React.FC<ProfessionalCardProps> = ({
  professional,
  onInvite,
  alreadyInvited = false
}) => {
  const {
    id,
    first_name,
    last_name,
    role,
    company_name,
    specializations,
    bio,
    verified,
    years_experience,
    city,
    postcode,
    profile_image_url
  } = professional;

  // Helper function to format role for display
  const formatRole = (role: string | null): string => {
    if (!role) return 'Professional';
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  // Create initials for avatar placeholder
  const getInitials = (): string => {
    const firstInitial = first_name && first_name.length > 0 ? first_name.charAt(0) : '?';
    const lastInitial = last_name && last_name.length > 0 ? last_name.charAt(0) : '';
    return `${firstInitial}${lastInitial}`;
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.profileInfo}>
          {profile_image_url ? (
            <div className={styles.avatar} style={{ backgroundImage: `url(${profile_image_url})` }} />
          ) : (
            <div className={styles.avatarPlaceholder}>
              {getInitials()}
            </div>
          )}
          
          <div className={styles.nameSection}>
            <h3 className={styles.name}>
              {first_name || 'Unknown'} {last_name || ''}
              {verified && (
                <span className={styles.verifiedBadge} title="Verified Professional">✓</span>
              )}
            </h3>
            
            <div className={styles.roleInfo}>
              <span className={styles.role}>{formatRole(role)}</span>
              {company_name && <span className={styles.company}> • {company_name}</span>}
            </div>
            
            {years_experience && (
              <span className={styles.experience}>{years_experience} years experience</span>
            )}
            
            {city && <span className={styles.location}>{city}</span>}
          </div>
        </div>
        
        {/* Rating section removed as it's not in your database schema */}
      </div>
      
      {specializations && specializations.length > 0 && (
        <div className={styles.specializations}>
          {specializations.map((specialization, index) => (
            <span key={index} className={styles.specializationTag}>
              {specialization}
            </span>
          ))}
        </div>
      )}
      
      {bio && <p className={styles.bio}>{bio}</p>}
      
      {onInvite && (
        <div className={styles.actions}>
          <button
            onClick={() => onInvite(id)}
            className={alreadyInvited ? styles.alreadyInvited : styles.inviteButton}
            disabled={alreadyInvited}
          >
            {alreadyInvited ? 'Invited' : 'Invite to Project'}
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfessionalCard;
// app/components/property/PropertyList.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Property } from '@/types/supabase';
import PropertyCard from './PropertyCard';
import styles from './styles/PropertyList.module.css';

export interface PropertyListProps {
  properties: Property[];
}

type SortOption = 'newest' | 'oldest' | 'name_asc' | 'name_desc';

export default function PropertyList({ properties }: PropertyListProps) {
  const router = useRouter();
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  
  // Sort properties based on selected option
  const sortedProperties = [...properties].sort((a, b) => {
    switch (sortOption) {
      case 'newest':
        return new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime();
      case 'oldest':
        return new Date(a.created_at || '').getTime() - new Date(b.created_at || '').getTime();
      case 'name_asc':
        return (a.property_name || '').localeCompare(b.property_name || '');
      case 'name_desc':
        return (b.property_name || '').localeCompare(a.property_name || '');
      default:
        return 0;
    }
  });

  const handlePropertyClick = (id: string) => {
    router.push(`/properties/${id}`);
  };
  
  return (
    <div className={styles.listContainer}>
      <div className={styles.listHeader}>
        <span className={styles.propertyCount}>
          {properties.length} {properties.length === 1 ? 'Property' : 'Properties'}
        </span>
        <div className={styles.sortContainer}>
          <label htmlFor="sort" className={styles.sortLabel}>Sort by:</label>
          <select
            id="sort"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as SortOption)}
            className={styles.sortSelect}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="name_asc">Name (A-Z)</option>
            <option value="name_desc">Name (Z-A)</option>
          </select>
        </div>
      </div>
      
      <div className={styles.grid}>
        {sortedProperties.map(property => (
          <PropertyCard 
            key={property.id} 
            property={property} 
            onClick={() => handlePropertyClick(property.id)} 
          />
        ))}
      </div>
    </div>
  );
}
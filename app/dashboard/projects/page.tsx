// File: app/dashboard/projects/page.tsx
"use client"

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import ProjectList from '@/components/projects/ProjectsList';
import styles from './styles/ProjectsPage.module.css';
import { ProjectWithRelations } from '@/types/supabase';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
async function fetchProjects() {
  setLoading(true);
  try {
    console.log("Fetching projects...");
    
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("User not authenticated");
    }
    
    // Step 1: Get basic project data for the current user
    const { data: projectsData, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', user.id)  // Filter by the current user's ID
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Supabase error:", error);
      throw error;
    }

    // Step 2: Fetch property data for each project
    const projectsWithProperties = await Promise.all(
      (projectsData || []).map(async (project) => {
        // Get property data
        const { data: propertyData } = await supabase
          .from('properties')
          .select('id, address_line1, address_line2, city, postal_code')
          .eq('id', project.property_id)
          .single();
        
        return {
          ...project,
          properties: propertyData || null
        };
      })
    );
    
    console.log("Projects retrieved:", projectsWithProperties);
    setProjects(projectsWithProperties);
  } catch (err) {
    console.error('Error details:', err);
    setError('Failed to load projects. Please refresh the page.');
  } finally {
    setLoading(false);
  }
}

    fetchProjects();
  }, [supabase]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>My Projects</h1>
        <Link href="/dashboard/projects/create">
          <button className={styles.createButton}>Create New Project</button>
        </Link>
      </div>

      {loading ? (
        <div className={styles.loadingContainer}>
          <p>Loading projects...</p>
        </div>
      ) : error ? (
        <div className={styles.errorContainer}>
          <p>{error}</p>
        </div>
      ) : projects.length === 0 ? (
        <div className={styles.emptyContainer}>
          <h2>No projects found</h2>
          <p>Get started by creating your first project</p>
          <Link href="/dashboard/projects/create">
            <button className={styles.createButton}>Create New Project</button>
          </Link>
        </div>
      ) : (
        <ProjectList projects={projects} />
      )}
    </div>
  );
}
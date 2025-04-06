// File: app/components/projects/ProjectList.tsx
import React from 'react';
import Link from 'next/link';
import ProjectCard from './ProjectCard';
import styles from './styles/ProjectList.module.css';

interface ProjectListProps {
  projects: any[];
}

const ProjectList: React.FC<ProjectListProps> = ({ projects }) => {
  return (
    <div className={styles.projectList}>
      {projects.map((project) => (
        <Link href={`/dashboard/projects/${project.id}`} key={project.id}>
          <div className={styles.projectCardWrapper}>
            <ProjectCard project={project} />
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ProjectList;
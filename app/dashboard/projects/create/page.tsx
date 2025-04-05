// app/dashboard/projects/create/page.tsx

import React from 'react';
import QuickProjectStart from '@/components/projects/QuickProjectStart';
import styles from './styles/CreateProject.module.css';

export default function CreateProjectPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Create a New Project</h1>
      <p className={styles.pageDescription}>
        Start by providing some basic information about your project. This will help us match you with the right professionals.
      </p>
      
      <QuickProjectStart />
    </div>
  );
}
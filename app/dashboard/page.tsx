'use client';

// src/app/dashboard/page.tsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabase/client';
import styles from './styles/Dashboard.module.css';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          // No active session, redirect to login
          router.push('/auth/login');
          return;
        }
        
        // Get user profile information
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
          
        if (error) throw error;
        
        setUser({
          ...session.user,
          ...profile
        });
      } catch (error) {
        console.error('Error loading user:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, [router]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return <div className={styles.loadingContainer}>Loading...</div>;
  }

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.dashboardHeader}>
        <h1 className={styles.dashboardTitle}>Dashboard</h1>
        <button 
          onClick={handleLogout}
          className={styles.logoutButton}
        >
          Logout
        </button>
      </div>

      <div className={styles.card}>
        <h2 className={styles.cardTitle}>Welcome, {user?.full_name || 'User'}</h2>
        <p className={styles.userInfo}>Email: {user?.email}</p>
        <p className={styles.userInfo}>User Role: {user?.role}</p>
      </div>

      {/* Dashboard content based on user type */}
      {user?.role === 'admin' && (
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Admin Controls</h2>
          {/* Admin-specific dashboard content */}
          <p className={styles.userInfo}>You have access to admin features.</p>
        </div>
      )}

      {user?.role === 'property_owner' && (
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Your Properties</h2>
          {/* Property owner specific dashboard content */}
          <p className={styles.userInfo}>Manage your properties here.</p>
        </div>
      )}

      {user?.role === 'contractor' && (
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Your Projects</h2>
          {/* Contractor specific dashboard content */}
          <p className={styles.userInfo}>View your ongoing projects here.</p>
        </div>
      )}
      
      {user?.role === 'surveyor' && (
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Your Surveys</h2>
          {/* Surveyor specific dashboard content */}
          <p className={styles.userInfo}>Manage your survey assignments here.</p>
        </div>
      )}
    </div>
  );
}
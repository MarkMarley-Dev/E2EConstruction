'use client';

// src/app/components/auth/LoginForm.tsx
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import styles from './styles/Auth.module.css';

type LoginFormProps = {
  redirectTo?: string;
};

export function LoginForm({ redirectTo }: LoginFormProps = {}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  // Get redirectTo from props or URL query parameter
  const finalRedirectTo = redirectTo || searchParams.get('redirectTo') || '/';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    console.log("Login attempt with:", email);

    try {
      console.log("Calling Supabase auth...");
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log("Auth response:", data, error);
      
      // Check if session exists
      const currentSession = await supabase.auth.getSession();
      console.log("Current session:", currentSession);

      if (error) throw error;
      
      console.log("Login successful, redirecting to:", finalRedirectTo);
      // Use window.location for a hard redirect instead of router
      window.location.href = finalRedirectTo;
    } catch (error: any) {
      console.error("Login error:", error);
      setError(error.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <form onSubmit={handleLogin} className={styles.authForm}>
        <h1 className={styles.authTitle}>Log In</h1>
        
        {error && <div className={styles.authError}>{error}</div>}
        
        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.formLabel}>Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.formInput}
            required
          />
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="password" className={styles.formLabel}>Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.formInput}
            required
          />
        </div>
        
        <button 
          type="submit" 
          className={styles.authButton}
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Log In'}
        </button>
        
        <div className={styles.authLinks}>
          <Link href="/auth/register" className={styles.authLink}>
            Don't have an account? Sign up
          </Link>
          <Link href="/auth/forgot-password" className={styles.authLink}>
            Forgot password?
          </Link>
        </div>
      </form>
    </div>
  );
}
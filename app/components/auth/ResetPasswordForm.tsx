
// components/auth/ResetPasswordForm.tsx
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { supabase } from '../../lib/supabase/client';
import styles from './Auth.module.css';

export function ResetPasswordForm() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Check if user is in recovery mode
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/auth/login');
      }
    };
    
    checkSession();
  }, [router]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) throw error;
      
      setSuccess(true);
      
      // Redirect after a few seconds
      setTimeout(() => {
        router.push('/auth/login');
      }, 3000);
      
    } catch (error: any) {
      setError(error.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <form onSubmit={handleResetPassword} className={styles.authForm}>
        <h1 className={styles.authTitle}>Set New Password</h1>
        
        {error && <div className={styles.authError}>{error}</div>}
        {success && (
          <div className={styles.authSuccess}>
            Password successfully reset. Redirecting to login...
          </div>
        )}
        
        {!success && (
          <>
            <div className={styles.formGroup}>
              <label htmlFor="password" className={styles.formLabel}>New Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.formInput}
                required
                minLength={6}
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="confirmPassword" className={styles.formLabel}>Confirm New Password</label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={styles.formInput}
                required
                minLength={6}
              />
            </div>
            
            <button 
              type="submit" 
              className={styles.authButton}
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Set New Password'}
            </button>
          </>
        )}
        
        <div className={styles.authLinks}>
          <Link href="/auth/login" className={styles.authLink}>
            Back to Login
          </Link>
        </div>
      </form>
    </div>
  );
}

// components/auth/ForgotPasswordForm.tsx
import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '../../../lib/supabase/client';
import styles from './styles/Auth.module.css';

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) throw error;
      
      setSuccess(true);
    } catch (error: any) {
      setError(error.message || 'An error occurred while sending the reset link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <form onSubmit={handleResetPassword} className={styles.authForm}>
        <h1 className={styles.authTitle}>Reset Your Password</h1>
        
        {error && <div className={styles.authError}>{error}</div>}
        {success && (
          <div className={styles.authSuccess}>
            If an account exists with that email, we've sent password reset instructions.
          </div>
        )}
        
        {!success && (
          <>
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
            
            <button 
              type="submit" 
              className={styles.authButton}
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
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

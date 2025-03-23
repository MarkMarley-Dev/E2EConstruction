
// components/auth/RegisterForm.tsx
import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import styles from './Auth.module.css';
import { useSearchParams } from 'next/navigation';

type RegisterFormProps = {
  redirectTo?: string;
};

export function RegisterForm({ redirectTo }: RegisterFormProps = {}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  // Get redirectTo from props or URL query parameter
  const finalRedirectTo = redirectTo || searchParams.get('redirectTo') || '/';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [userType, setUserType] = useState('property_owner');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Form validation
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      // Register user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            user_type: userType,
          },
        },
      });

      if (authError) throw authError;

      // Create user profile in database
      if (authData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            full_name: fullName,
            email: email,
            user_type: userType,
          });

        if (profileError) throw profileError;
      }

      // Redirect or show confirmation screen
      router.push('/auth/verification');
    } catch (error: any) {
      setError(error.message || 'An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <form onSubmit={handleRegister} className={styles.authForm}>
        <h1 className={styles.authTitle}>Create an Account</h1>
        
        {error && <div className={styles.authError}>{error}</div>}
        
        <div className={styles.formGroup}>
          <label htmlFor="fullName" className={styles.formLabel}>Full Name</label>
          <input
            id="fullName"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className={styles.formInput}
            required
          />
        </div>
        
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
            minLength={6}
          />
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="confirmPassword" className={styles.formLabel}>Confirm Password</label>
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
        
        <div className={styles.formGroup}>
          <label htmlFor="userType" className={styles.formLabel}>I am a:</label>
          <select
            id="userType"
            value={userType}
            onChange={(e) => setUserType(e.target.value)}
            className={styles.formSelect}
            required
          >
            <option value="property_owner">Property Owner</option>
            <option value="contractor">Contractor</option>
            <option value="surveyor">Surveyor</option>
          </select>
        </div>
        
        <button 
          type="submit" 
          className={styles.authButton}
          disabled={loading}
        >
          {loading ? 'Creating account...' : 'Create Account'}
        </button>
        
        <div className={styles.authLinks}>
          <Link href="/auth/login" className={styles.authLink}>
            Already have an account? Log in
          </Link>
        </div>
      </form>
    </div>
  );
}

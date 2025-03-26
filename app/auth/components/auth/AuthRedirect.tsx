'use client';

// src/app/components/auth/AuthRedirect.tsx
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabase/client';

type AuthRedirectProps = {
  redirectAuthenticated?: string;
  redirectUnauthenticated?: string | null;
};

export function AuthRedirect({ 
  redirectAuthenticated = '/dashboard', 
  redirectUnauthenticated = '/auth/login'
}: AuthRedirectProps) {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          // User is authenticated, redirect to dashboard
          router.push(redirectAuthenticated);
        } else if (redirectUnauthenticated) {
          // Optional: redirect to login page if not authenticated
          // Comment this out if you want unauthenticated users to stay on the current page
          router.push(redirectUnauthenticated);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
      }
    };

    checkAuth();
  }, [router, redirectAuthenticated, redirectUnauthenticated]);

  // Return null as this is just a utility component
  return null;
}
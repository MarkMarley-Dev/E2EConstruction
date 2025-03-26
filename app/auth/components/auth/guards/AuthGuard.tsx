'use client';

// src/app/components/auth/guards/AuthGuard.tsx
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../../../../context/AuthContext';

type AuthGuardProps = {
  children: React.ReactNode;
};

export function AuthGuard({ children }: AuthGuardProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const pathname = usePathname();

  useEffect(() => {
    // Auth initialization not yet completed
    if (isLoading) return;

    // If user is not authenticated, redirect to login
    if (!user) {
      // In App Router, we handle the redirect differently
      const redirectUrl = pathname !== '/auth/login' ? 
        `/auth/login?redirectTo=${encodeURIComponent(pathname)}` : 
        '/auth/login';
      
      router.push(redirectUrl);
    } else {
      setIsAuthenticated(true);
    }
  }, [user, isLoading, router, pathname]);

  // Show loading or nothing during authentication checking
  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If authenticated, render children
  return <>{children}</>;
}

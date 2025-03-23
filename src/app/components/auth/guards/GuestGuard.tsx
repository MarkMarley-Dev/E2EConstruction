
// src/app/components/auth/guards/GuestGuard.tsx
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

type GuestGuardProps = {
  children: React.ReactNode;
};

export function GuestGuard({ children }: GuestGuardProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    // Auth initialization not yet completed
    if (isLoading) return;

    // If user is already authenticated, redirect to dashboard or redirectTo
    if (user) {
      const redirectTo = searchParams.get('redirectTo') || '/dashboard';
      router.push(redirectTo);
    } else {
      setIsGuest(true);
    }
  }, [user, isLoading, router, searchParams]);

  // Show loading or nothing during authentication checking
  if (isLoading || !isGuest) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If guest (not authenticated), render children
  return <>{children}</>;
}
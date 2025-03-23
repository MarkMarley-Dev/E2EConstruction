
// src/app/components/auth/guards/RoleGuard.tsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

type RoleGuardProps = {
  children: React.ReactNode;
  allowedRoles: ('property_owner' | 'contractor' | 'surveyor')[];
  fallbackPath?: string;
};

export function RoleGuard({ 
  children, 
  allowedRoles, 
  fallbackPath = '/dashboard'
}: RoleGuardProps) {
  const { profile, isLoading } = useAuth();
  const router = useRouter();
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    // Auth initialization not yet completed
    if (isLoading) return;

    // Check if user has the required role
    if (profile && allowedRoles.includes(profile.user_type)) {
      setHasAccess(true);
    } else if (profile) {
      // User authenticated but doesn't have the right role
      router.push(fallbackPath);
    }
  }, [profile, isLoading, allowedRoles, router, fallbackPath]);

  // Show loading or nothing during access checking
  if (isLoading || !hasAccess) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If user has access, render children
  return <>{children}</>;
}
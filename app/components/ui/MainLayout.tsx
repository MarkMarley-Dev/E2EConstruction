// app/components/ui/MainLayout.tsx
"use client"

import React from 'react';
import { usePathname } from 'next/navigation';
import NavBar from './NavBar';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  
  // Don't show navbar on these paths
  const noNavbarPaths = ['/', '/auth/login', '/auth/register'];
  const showNavbar = !noNavbarPaths.includes(pathname);
  
  return (
    <>
      {showNavbar && <NavBar />}
      <main className="main-content">
        {children}
      </main>
    </>
  );
};

export default MainLayout;
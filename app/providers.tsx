'use client';

// src/app/providers.tsx
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/themeContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (

    <AuthProvider>
      <ThemeProvider>
      {children}
      </ThemeProvider>
    </AuthProvider>
  );
}

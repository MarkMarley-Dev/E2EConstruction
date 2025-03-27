// @/app/context/ThemeContext.tsx

import React, { createContext, useContext, useState, useEffect } from 'react';

type ThemeType = 'blueprint' | 'minimalist' | 'construction';

interface ThemeContextType {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeType>('blueprint');

  useEffect(() => {
    // Load theme from localStorage if available
    const savedTheme = localStorage.getItem('theme') as ThemeType;
    if (savedTheme && ['blueprint', 'minimalist', 'construction'].includes(savedTheme)) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    // Apply theme by adding a class to the document body
    document.body.className = `theme-${theme}`;
    
    // Save theme preference to localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
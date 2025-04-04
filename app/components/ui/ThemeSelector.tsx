"use client"

import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '@/context/themeContext';
import styles from './styles/ThemeSelector.module.css';

const ThemeSelector: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const themes = [
    { id: 'blueprint', name: 'Blueprint', icon: '📘' },
    { id: 'minimalist', name: 'Minimalist', icon: '🔲' },
    { id: 'construction', name: 'Construction', icon: '🏗️' }
  ];

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleThemeChange = (newTheme: 'blueprint' | 'minimalist' | 'construction') => {
    setTheme(newTheme);
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Get current theme info
  const currentTheme = themes.find(t => t.id === theme) || themes[0];

  return (
    <div className={styles.themeSelector} ref={dropdownRef}>
      <button 
        className={`${styles.themeSelectorButton} ${styles[theme]}`}
        onClick={toggleDropdown}
        aria-label="Select theme"
        aria-expanded={isOpen}
      >
        <span className={styles.themeIcon}>{currentTheme.icon}</span>
        <span className={styles.themeName}>{currentTheme.name}</span>
        <span className={styles.dropdownArrow}>▼</span>
      </button>

      {isOpen && (
        <div className={`${styles.dropdown} ${styles[theme]}`}>
          {themes.map(themeOption => (
            <button
              key={themeOption.id}
              className={`${styles.themeOption} ${theme === themeOption.id ? styles.active : ''}`}
              onClick={() => handleThemeChange(themeOption.id as 'blueprint' | 'minimalist' | 'construction')}
            >
              <span className={styles.themeIcon}>{themeOption.icon}</span>
              <span>{themeOption.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ThemeSelector;
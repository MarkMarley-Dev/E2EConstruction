"use client"

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/context/themeContext';
import ThemeSelector from './ThemeSelector';
import styles from './styles/Navbar.module.css';

interface NavItem {
  title: string;
  path: string;
  icon?: React.ReactNode;
  children?: NavItem[];
}

const NavBar: React.FC = () => {
  const pathname = usePathname();
  const { theme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Updated navItems based on your actual project structure
  const navItems: NavItem[] = [
    { title: 'Home', path: '/' },
    { title: 'Dashboard', path: '/dashboard' },
    { title: 'Properties', path: '/properties' },
    { title: 'Design System', path: '/design-system' },
  ];

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className={`${styles.navbar} ${styles[theme]}`}>
      <div className={styles.navContainer}>
        <div className={styles.navBrand}>
          <Link href="/">
            <span className={styles.brandName}>Construction Platform</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className={styles.navLinksDesktop}>
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              href={item.path}
              className={`${styles.navLink} ${pathname === item.path ? styles.active : ''}`}
            >
              {item.title}
            </Link>
          ))}
        </div>

        {/* Theme Selector */}
        <div className={styles.navControls}>
          <ThemeSelector />
        </div>

        {/* Mobile Menu Toggle Button */}
        <button 
          className={styles.mobileMenuButton} 
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          <span className={styles.menuBar}></span>
          <span className={styles.menuBar}></span>
          <span className={styles.menuBar}></span>
        </button>

        {/* Mobile Navigation */}
        <div className={`${styles.navLinksMobile} ${mobileMenuOpen ? styles.open : ''}`}>
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              href={item.path}
              className={`${styles.navLink} ${pathname === item.path ? styles.active : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.title}
            </Link>
          ))}
          <div className={styles.mobileThemeSelector}>
            <ThemeSelector />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import styles from './Header.module.css';
import { supabase } from '@/lib/supabase/client';
import { useCountry, Country } from '@/context/CountryContext';
import { User } from '@supabase/supabase-js';

export const Header: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { selectedCountry, setSelectedCountry, countries } = useCountry();

  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);

  const [isCountryOpen, setIsCountryOpen] = useState<boolean>(false);
  const [isUserOpen, setIsUserOpen] = useState<boolean>(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  const [focusedCountryIdx, setFocusedCountryIdx] = useState<number>(-1);

  const countryWrapperRef = useRef<HTMLDivElement>(null);
  const countryBtnRef = useRef<HTMLButtonElement>(null);
  const countryListRef = useRef<HTMLUListElement>(null);

  const userWrapperRef = useRef<HTMLDivElement>(null);
  const userBtnRef = useRef<HTMLButtonElement>(null);

  const drawerContentRef = useRef<HTMLDivElement>(null);
  const hamburgerBtnRef = useRef<HTMLButtonElement>(null);

  // 1. Supabase auth session listener
  useEffect(() => {
    let isMounted = true;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (isMounted) {
        setUser(session?.user ?? null);
        setAuthLoading(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (isMounted) {
        setUser(session?.user ?? null);
        setAuthLoading(false);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // 2. Close menus on route change
  useEffect(() => {
    setIsDrawerOpen(false);
    setIsCountryOpen(false);
    setIsUserOpen(false);
  }, [pathname]);

  // 3. Click outside listener for dropdowns
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        countryWrapperRef.current &&
        !countryWrapperRef.current.contains(e.target as Node)
      ) {
        setIsCountryOpen(false);
      }
      if (
        userWrapperRef.current &&
        !userWrapperRef.current.contains(e.target as Node)
      ) {
        setIsUserOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 4. Keyboard focus trap & Escape for mobile drawer
  useEffect(() => {
    if (!isDrawerOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsDrawerOpen(false);
        hamburgerBtnRef.current?.focus();
        return;
      }

      if (e.key === 'Tab' && drawerContentRef.current) {
        const focusables = drawerContentRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;

        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isDrawerOpen]);

  // Keyboard navigation for Country selector
  const handleCountryBtnKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsCountryOpen(true);
      setFocusedCountryIdx(0);
    } else if (e.key === 'Escape') {
      setIsCountryOpen(false);
    }
  };

  const handleCountryListKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedCountryIdx((prev) => (prev + 1) % countries.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedCountryIdx((prev) => (prev - 1 + countries.length) % countries.length);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (focusedCountryIdx >= 0 && focusedCountryIdx < countries.length) {
        setSelectedCountry(countries[focusedCountryIdx]);
        setIsCountryOpen(false);
        countryBtnRef.current?.focus();
      }
    } else if (e.key === 'Escape') {
      setIsCountryOpen(false);
      countryBtnRef.current?.focus();
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsUserOpen(false);
    setIsDrawerOpen(false);
    router.push('/');
  };

  const userInitial = user?.email ? user.email[0].toUpperCase() : 'U';
  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Account';

  return (
    <header className={styles.header}>

      {/* Main Header Navigation Bar */}
      <div className={styles.mainNav}>
        <div className={`container ${styles.mainNavContainer}`}>
          {/* Logo (Left) */}
          <Link href="/" className={styles.logoLink} onClick={() => setIsDrawerOpen(false)}>
            <div className={styles.logoWrapper}>
              <Image
                src="/images/logo.png"
                alt="Aariva Voyages Logo"
                width={40}
                height={40}
                className={styles.logoImg}
                priority
              />
            </div>
            <div className={styles.brandText}>
              <span className={styles.brandTitle}>Aariva Voyages</span>
              <span className={styles.brandSubtitle}>Curated Journeys,Timeless Memories</span>
            </div>
          </Link>

          {/* Center Navigation Links */}
          <nav className={styles.desktopNav} aria-label="Main Navigation">
            <Link
              href="/"
              className={`${styles.navLink} ${pathname === '/' ? styles.activeNavLink : ''}`}
            >
              Home
            </Link>
            <Link
              href="/packages"
              className={`${styles.navLink} ${pathname.startsWith('/packages') ? styles.activeNavLink : ''
                }`}
            >
              Packages
            </Link>
            <a href="#contact" className={styles.navLink}>
              Contact
            </a>
            {/* Show My Bookings ONLY when user is authenticated */}
            {user && (
              <Link
                href="/bookings"
                className={`${styles.navLink} ${pathname.startsWith('/bookings') ? styles.activeNavLink : ''
                  }`}
              >
                My Bookings
              </Link>
            )}
          </nav>

          {/* Right Actions: Choose Country + Login / User Menu */}
          <div className={styles.rightActions}>
            {/* 1. Choose Country Selector */}
            <div ref={countryWrapperRef} className={styles.countrySelectorWrapper}>
              <button
                ref={countryBtnRef}
                type="button"
                className={styles.countryBtn}
                onClick={() => setIsCountryOpen(!isCountryOpen)}
                onKeyDown={handleCountryBtnKeyDown}
                aria-haspopup="listbox"
                aria-expanded={isCountryOpen}
                aria-label={`Select country, current: ${selectedCountry.name}`}
              >
                <span>{selectedCountry.flag}</span>
                <span>{selectedCountry.code}</span>
                <span style={{ fontSize: '10px' }}>▾</span>
              </button>

              {isCountryOpen && (
                <ul
                  ref={countryListRef}
                  className={styles.countryDropdown}
                  role="listbox"
                  tabIndex={-1}
                  onKeyDown={handleCountryListKeyDown}
                  aria-label="Country options"
                >
                  {countries.map((c, idx) => {
                    const isSelected = c.code === selectedCountry.code;
                    const isFocused = idx === focusedCountryIdx;
                    return (
                      <li
                        key={c.code}
                        role="option"
                        aria-selected={isSelected}
                        className={`${styles.countryOption} ${isSelected ? styles.countryOptionSelected : ''
                          } ${isFocused ? styles.countryOptionFocused : ''}`}
                        onClick={() => {
                          setSelectedCountry(c);
                          setIsCountryOpen(false);
                          countryBtnRef.current?.focus();
                        }}
                      >
                        <div className={styles.countryLeft}>
                          <span>{c.flag}</span>
                          <span>{c.name}</span>
                        </div>
                        <span className={styles.currencyText}>{c.currency}</span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {/* 2. Login / Auth Section */}
            {authLoading ? (
              <div className={styles.authPlaceholder} />
            ) : user ? (
              /* Logged In User Dropdown */
              <div ref={userWrapperRef} className={styles.userMenuWrapper}>
                <button
                  ref={userBtnRef}
                  type="button"
                  className={styles.avatarBtn}
                  onClick={() => setIsUserOpen(!isUserOpen)}
                  aria-haspopup="menu"
                  aria-expanded={isUserOpen}
                  aria-label="User Account Menu"
                >
                  <div className={styles.avatarCircle}>{userInitial}</div>
                  <span className={styles.userName}>{userName}</span>
                  <span style={{ fontSize: '10px' }}>▾</span>
                </button>

                {isUserOpen && (
                  <div className={styles.userDropdown} role="menu">
                    <div className={styles.userDropdownHeader}>
                      <span className={styles.userEmailText}>{user.email}</span>
                    </div>
                    <Link
                      href="/bookings"
                      className={styles.userDropdownItem}
                      role="menuitem"
                      onClick={() => setIsUserOpen(false)}
                    >
                      📅 My Bookings
                    </Link>
                    <Link
                      href="/wishlist"
                      className={styles.userDropdownItem}
                      role="menuitem"
                      onClick={() => setIsUserOpen(false)}
                    >
                      ❤️ Wishlist
                    </Link>
                    <button
                      type="button"
                      className={`${styles.userDropdownItem} ${styles.logoutItem}`}
                      role="menuitem"
                      onClick={handleLogout}
                    >
                      🚪 Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Logged Out Login Button */
              <div className={styles.authGroup}>
                <Link href="/login" className={styles.loginBtn}>
                  Login
                </Link>
                <Link href="/signup" className={styles.signupLink}>
                  Sign up
                </Link>
              </div>
            )}

            {/* Hamburger Button for Mobile (<640px) */}
            <button
              ref={hamburgerBtnRef}
              type="button"
              className={styles.hamburgerBtn}
              onClick={() => setIsDrawerOpen(!isDrawerOpen)}
              aria-label="Toggle navigation drawer"
              aria-expanded={isDrawerOpen}
            >
              <span className={`${styles.bar} ${isDrawerOpen ? styles.barOpenTop : ''}`} />
              <span className={`${styles.bar} ${isDrawerOpen ? styles.barOpenMid : ''}`} />
              <span className={`${styles.bar} ${isDrawerOpen ? styles.barOpenBot : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer (<640px) */}
      <div
        className={`${styles.drawerOverlay} ${isDrawerOpen ? styles.drawerOpen : ''}`}
        onClick={() => setIsDrawerOpen(false)}
        aria-hidden={!isDrawerOpen}
      >
        <div
          ref={drawerContentRef}
          className={styles.drawerContent}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={styles.drawerHeader}>
            <div className={styles.brandText}>
              <span className={styles.brandTitle}>Aariva Voyages</span>
              <span className={styles.brandSubtitle}>DOMESTIC TOURS</span>
            </div>
            <button
              type="button"
              className={styles.closeDrawerBtn}
              onClick={() => setIsDrawerOpen(false)}
              aria-label="Close menu"
            >
              ✕
            </button>
          </div>

          {/* Navigation Links inside Drawer */}
          <nav className={styles.drawerNav}>
            <Link
              href="/"
              className={`${styles.drawerLink} ${pathname === '/' ? styles.drawerLinkActive : ''}`}
              onClick={() => setIsDrawerOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/packages"
              className={`${styles.drawerLink} ${pathname.startsWith('/packages') ? styles.drawerLinkActive : ''
                }`}
              onClick={() => setIsDrawerOpen(false)}
            >
              Packages
            </Link>
            <a
              href="#contact"
              className={styles.drawerLink}
              onClick={() => setIsDrawerOpen(false)}
            >
              Contact
            </a>
            {user && (
              <Link
                href="/bookings"
                className={`${styles.drawerLink} ${pathname.startsWith('/bookings') ? styles.drawerLinkActive : ''
                  }`}
                onClick={() => setIsDrawerOpen(false)}
              >
                My Bookings
              </Link>
            )}
          </nav>

          {/* Choose Country Section inside Mobile Drawer */}
          <div className={styles.drawerSection}>
            <span className={styles.drawerSectionTitle}>CHOOSE COUNTRY</span>
            <div className={styles.drawerCountryList}>
              {countries.map((c) => {
                const isSelected = c.code === selectedCountry.code;
                return (
                  <button
                    key={c.code}
                    type="button"
                    className={`${styles.drawerCountryItem} ${isSelected ? styles.drawerCountryItemSelected : ''
                      }`}
                    onClick={() => {
                      setSelectedCountry(c);
                      setIsDrawerOpen(false);
                    }}
                  >
                    <span>{c.flag}</span>
                    <span>{c.code}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Login / User Section inside Mobile Drawer */}
          <div className={styles.drawerAuthBox}>
            {authLoading ? (
              <div className={styles.authPlaceholder} style={{ width: '100%' }} />
            ) : user ? (
              <>
                <div className={styles.drawerUserHeader}>
                  <div className={styles.drawerUserAvatar}>{userInitial}</div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>
                      {userName}
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>{user.email}</div>
                  </div>
                </div>
                <Link
                  href="/bookings"
                  className={styles.drawerLink}
                  onClick={() => setIsDrawerOpen(false)}
                >
                  📅 My Bookings
                </Link>
                <Link
                  href="/wishlist"
                  className={styles.drawerLink}
                  onClick={() => setIsDrawerOpen(false)}
                >
                  ❤️ Wishlist
                </Link>
                <button
                  type="button"
                  className={styles.drawerLogoutBtn}
                  onClick={handleLogout}
                >
                  🚪 Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className={styles.drawerLoginBtn}
                  onClick={() => setIsDrawerOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className={styles.drawerSignupBtn}
                  onClick={() => setIsDrawerOpen(false)}
                >
                  Create Account / Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

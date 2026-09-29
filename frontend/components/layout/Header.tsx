'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Header.module.css';
import { CallbackModal } from '../common/CallbackModal';

export const Header: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCallbackOpen, setIsCallbackOpen] = useState(false);

  const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);
  const closeDrawer = () => setIsDrawerOpen(false);

  return (
    <>
      <header className={styles.header}>
        {/* 1. Top Utility Bar */}
        <div className={styles.topBar}>
          <div className={`container ${styles.topBarContainer}`}>
            <div className={styles.promoItem}>
              <span className={styles.promoTag}>SUMMER SPECIAL</span>
              <span>Flat 20% OFF on Himalayan &amp; Island Expeditions</span>
            </div>

            <div className={styles.utilityActions}>
              <div className={styles.currencyBadge}>
                <span>INR ₹</span>
              </div>
              <a
                href="https://wa.me/919876543210?text=Hi%20Aariva%20Voyages,%20I%20would%20like%20to%20inquire%20about%20domestic%20tour%20packages."
                target="_blank"
                rel="noopener noreferrer"
                className={styles.whatsappLink}
              >
                <span className={styles.whatsappIcon}>💬</span> WhatsApp Us
              </a>
              <a href="tel:+919876543210" className={styles.helplineLink}>
                <span className={styles.phoneIcon}>📞</span>
                <span>
                  24x7 Helpline: <strong>+91 98765 43210</strong>
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* 2. Main Navigation Bar */}
        <div className={styles.mainNav}>
          <div className={`container ${styles.mainNavContainer}`}>
            {/* Logo */}
            <Link href="/" className={styles.logoLink} onClick={closeDrawer}>
              <div className={styles.logoWrapper}>
                <Image
                  src="/images/logo.png"
                  alt="Aariva Voyages Logo"
                  width={44}
                  height={44}
                  className={styles.logoImg}
                  priority
                />
              </div>
              <div className={styles.brandText}>
                <span className={styles.brandTitle}>Aariva Voyages</span>
                <span className={styles.brandSubtitle}>EXPERIENCES &amp; TOURS</span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className={styles.desktopNav} aria-label="Main Navigation">
              <Link href="/" className={styles.navLink}>
                Home
              </Link>
              <Link href="/packages" className={styles.navLink}>
                Packages
              </Link>
              <Link href="/packages?audience=couple" className={styles.navLink}>
                Honeymoon
              </Link>
              <Link href="/packages?audience=group" className={styles.navLink}>
                Group &amp; Family
              </Link>
              <a href="#trust" className={styles.navLink}>
                Why Aariva
              </a>
              <a href="#contact" className={styles.navLink}>
                Contact
              </a>
            </nav>

            {/* Desktop Action & Search preview */}
            <div className={styles.rightActions}>
              <button
                type="button"
                className={styles.requestCallbackBtn}
                onClick={() => setIsCallbackOpen(true)}
              >
                Request Callback
              </button>

              {/* Hamburger Button for Mobile */}
              <button
                type="button"
                className={styles.hamburgerBtn}
                onClick={toggleDrawer}
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

        {/* 3. Sub-Nav Quick Hubs */}
        <div className={styles.subNavBar}>
          <div className={`container ${styles.subNavContainer}`}>
            <span className={styles.hubEyebrow}>TOP DESTINATIONS:</span>
            <div className={styles.hubLinks}>
              <Link href="/packages/sikkim-darjeeling" className={styles.hubLink}>
                Sikkim-Darjeeling
              </Link>
              <span className={styles.dot}>•</span>
              <Link href="/packages/assam-meghalaya" className={styles.hubLink}>
                Assam-Meghalaya
              </Link>
              <span className={styles.dot}>•</span>
              <Link href="/packages/andaman-4n-5d" className={styles.hubLink}>
                Andaman Islands
              </Link>
              <span className={styles.dot}>•</span>
              <Link href="/packages/lakshadweep" className={styles.hubLink}>
                Lakshadweep
              </Link>
              <span className={styles.dot}>•</span>
              <Link href="/packages/kashmir-couple-special" className={styles.hubLink}>
                Kashmir Valley
              </Link>
              <span className={styles.dot}>•</span>
              <Link
                href="/packages/andaman-luxury-honeymoon"
                className={`${styles.hubLink} ${styles.highlightHub}`}
              >
                Luxury Honeymoon
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div
        className={`${styles.drawerOverlay} ${isDrawerOpen ? styles.drawerOpen : ''}`}
        onClick={closeDrawer}
        aria-hidden={!isDrawerOpen}
      >
        <div className={styles.drawerContent} onClick={(e) => e.stopPropagation()}>
          <div className={styles.drawerHeader}>
            <div className={styles.brandText}>
              <span className={styles.brandTitle}>Aariva Voyages</span>
              <span className={styles.brandSubtitle}>DOMESTIC TOURS &amp; EXPEDITIONS</span>
            </div>
            <button className={styles.closeDrawerBtn} onClick={closeDrawer} aria-label="Close menu">
              ✕
            </button>
          </div>

          <nav className={styles.drawerNav}>
            <Link href="/" className={styles.drawerLink} onClick={closeDrawer}>
              Home
            </Link>
            <Link href="/packages" className={styles.drawerLink} onClick={closeDrawer}>
              All Packages
            </Link>
            <Link
              href="/packages?audience=couple"
              className={styles.drawerLink}
              onClick={closeDrawer}
            >
              Honeymoon Specials
            </Link>
            <Link
              href="/packages?audience=group"
              className={styles.drawerLink}
              onClick={closeDrawer}
            >
              Group &amp; Family Trips
            </Link>
            <a href="#trust" className={styles.drawerLink} onClick={closeDrawer}>
              Why Aariva Voyages
            </a>
            <a href="#contact" className={styles.drawerLink} onClick={closeDrawer}>
              Help &amp; Contact
            </a>
          </nav>

          <div className={styles.drawerActionBox}>
            <button
              className={styles.drawerCallbackBtn}
              onClick={() => {
                closeDrawer();
                setIsCallbackOpen(true);
              }}
            >
              Request Callback
            </button>

            <div className={styles.drawerHelpline}>
              <p>Speak to our travel expert:</p>
              <a href="tel:+919876543210" className={styles.drawerPhone}>
                📞 +91 98765 43210
              </a>
              <a
                href="https://wa.me/919876543210?text=Hi%20Aariva%20Voyages,%20I%20would%20like%20to%20inquire%20about%20domestic%20tour%20packages."
                target="_blank"
                rel="noopener noreferrer"
                className={styles.drawerWhatsapp}
              >
                💬 WhatsApp Chat
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Callback Inquiry Modal */}
      <CallbackModal isOpen={isCallbackOpen} onClose={() => setIsCallbackOpen(false)} />
    </>
  );
};

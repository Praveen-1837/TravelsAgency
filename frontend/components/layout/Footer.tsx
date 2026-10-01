'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Footer.module.css';
import { CallbackModal } from '../common/CallbackModal';

// Social Icon helper
const SocialIcon = ({ name }: { name: 'instagram' | 'facebook' | 'youtube' | 'twitter' }) => {
  switch (name) {
    case 'instagram':
      return (
        <svg xmlns="http://www.2300/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
        </svg>
      );
    case 'facebook':
      return (
        <svg xmlns="http://www.2300/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
        </svg>
      );
    case 'youtube':
      return (
        <svg xmlns="http://www.2300/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
          <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
        </svg>
      );
    case 'twitter':
      return (
        <svg xmlns="http://www.2300/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
        </svg>
      );

    default:
      return null;
  }
};

export const Footer: React.FC = () => {
  const [isCallbackOpen, setIsCallbackOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const openRequestCallbackModal = () => setIsCallbackOpen(true);
  const openContactFormModal = () => setIsHelpOpen(true);

  return (
    <footer className={styles.footer} role="contentinfo">
      <div className={styles.footerContainer}>
        {/* Logo Column */}
        <div className={styles.footerColumn}>
          <Link href="/" className={styles.logoLink} aria-label="Aariva Voyages Home">
            <Image
              src="/images/logo.png"
              alt="Aariva Voyages Logo"
              width={140}
              height={40}
              className={styles.logoImage}
              priority={false}
            />
          </Link>
          <p className={styles.tagline}>Curated journey, Timeless Memories</p>
          <p className={styles.trustBadge}>Trusted by 1M+ Travelers</p>
        </div>

        {/* About Aariva */}
        <div className={styles.footerColumn}>
          <h3 className={styles.columnHeader}>About Aariva</h3>
          <ul className={styles.linkList}>
            <li><Link href="/about">Who We Are</Link></li>
            <li><Link href="/packages">Our Packages</Link></li>
            <li><Link href="/support">On-Ground Support</Link></li>
            <li><Link href="/why-aariva">Why Book With Us</Link></li>
            <li><Link href="/reviews">Testimonials</Link></li>
            <li><Link href="/blog">Travel Blog</Link></li>
          </ul>
        </div>

        {/* Policies & Support */}
        <div className={styles.footerColumn}>
          <h3 className={styles.columnHeader}>Policies & Support</h3>
          <ul className={styles.linkList}>
            <li><Link href="/terms">Terms &amp; Conditions</Link></li>
            <li><Link href="/privacy">Privacy Policy</Link></li>
            <li><Link href="/cancellation-policy">Cancellation Policy</Link></li>
            <li><Link href="/travel-tips">Travel Tips &amp; FAQs</Link></li>
            <li><button type="button" onClick={openContactFormModal}>Help Center</button></li>
            <li><button type="button" onClick={openRequestCallbackModal}>Contact Us</button></li>
          </ul>
        </div>

        {/* Social */}
        <div className={styles.footerColumn}>
          <h3 className={styles.columnHeader}>Follow Us</h3>
          <div className={styles.socialIcons}>
            <a href="https://instagram.com/aariva_voyages" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <SocialIcon name="instagram" />
            </a>
            <a href="https://facebook.com/aariva_voyages" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <SocialIcon name="facebook" />
            </a>
            <a href="https://youtube.com/@aariva_voyages" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
              <SocialIcon name="youtube" />
            </a>
            <a href="https://twitter.com/aariva_voyages" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <SocialIcon name="twitter" />
            </a>

          </div>
        </div>
      </div>

      {/* Legal */}
      <div className={styles.footerLegal}>
        <p className={styles.copyright}>© 2026 Aariva Voyages. All rights reserved.</p>
      </div>

      {/* Modals */}
      <CallbackModal isOpen={isCallbackOpen} onClose={() => setIsCallbackOpen(false)} />
      {/* Fallback Help Center Modal (Optional, if it exists; otherwise just a placeholder alert for now) */}
      {isHelpOpen && (
        <CallbackModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
      )}
    </footer>
  );
};

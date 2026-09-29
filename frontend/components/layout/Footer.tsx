'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Footer.module.css';
import { CallbackModal } from '../common/CallbackModal';

export const Footer: React.FC = () => {
  const [isCallbackOpen, setIsCallbackOpen] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setNewsletterSubmitted(true);
    }
  };

  return (
    <>
      <footer className={styles.footer} id="contact">
        {/* Newsletter & Inquiry Banner */}
        <div className={styles.newsletterBanner}>
          <div className={`container ${styles.newsletterContainer}`}>
            <div className={styles.newsletterText}>
              <span className={styles.newsletterEyebrow}>STAY INSPIRED</span>
              <h3 className={styles.newsletterTitle}>Get Secret Deals &amp; Curated Itineraries</h3>
              <p className={styles.newsletterSubtitle}>
                Join 50,000+ Indian travelers discovering hidden gems across the country.
              </p>
            </div>

            <div className={styles.newsletterFormWrapper}>
              {newsletterSubmitted ? (
                <div className={styles.newsletterSuccess}>
                  ✓ Subscribed! You will receive our monthly travel digest.
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className={styles.newsletterForm}>
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className={styles.newsletterInput}
                  />
                  <button type="submit" className={styles.newsletterBtn}>
                    Subscribe
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className={`container ${styles.mainFooter}`}>
          <div className={styles.brandColumn}>
            <div className={styles.brandRow}>
              <Image
                src="/images/logo.png"
                alt="Aariva Voyages Logo"
                width={40}
                height={40}
                className={styles.footerLogo}
              />
              <span className={styles.footerBrandName}>Aariva Voyages</span>
            </div>
            <p className={styles.footerDesc}>
              A premier domestic travel company crafting personalized experiences, honeymoon
              retreats, and group holidays across India’s most captivating landscapes.
            </p>
            <div className={styles.contactChips}>
              <a href="tel:+919876543210" className={styles.contactChip}>
                📞 +91 98765 43210
              </a>
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.contactChip} ${styles.whatsappChip}`}
              >
                💬 WhatsApp 24x7
              </a>
            </div>
          </div>

          <div className={styles.linksGrid}>
            <div className={styles.column}>
              <h4 className={styles.columnTitle}>Top Destinations</h4>
              <ul className={styles.linkList}>
                <li>
                  <Link href="/packages/sikkim-darjeeling">Sikkim &amp; Darjeeling</Link>
                </li>
                <li>
                  <Link href="/packages/assam-meghalaya">Assam &amp; Meghalaya</Link>
                </li>
                <li>
                  <Link href="/packages/andaman-4n-5d">Andaman Islands</Link>
                </li>
                <li>
                  <Link href="/packages/lakshadweep">Lakshadweep Atolls</Link>
                </li>
                <li>
                  <Link href="/packages/kashmir-couple-special">Kashmir Valley</Link>
                </li>
              </ul>
            </div>

            <div className={styles.column}>
              <h4 className={styles.columnTitle}>Travel Styles</h4>
              <ul className={styles.linkList}>
                <li>
                  <Link href="/packages?audience=couple">Honeymoon Specials</Link>
                </li>
                <li>
                  <Link href="/packages?audience=group">Group &amp; Family Trips</Link>
                </li>
                <li>
                  <Link href="/packages">All Domestic Packages</Link>
                </li>
                <li>
                  <a href="#trust">Corporate &amp; Group Treks</a>
                </li>
              </ul>
            </div>

            <div className={styles.column}>
              <h4 className={styles.columnTitle}>Why Aariva</h4>
              <ul className={styles.linkList}>
                <li>
                  <span>Verified Local Marshals</span>
                </li>
                <li>
                  <span>Customizable Itineraries</span>
                </li>
                <li>
                  <span>100% Transparent Quotes</span>
                </li>
                <li>
                  <span>Emergency 24x7 Support</span>
                </li>
              </ul>
            </div>

            <div className={styles.column}>
              <h4 className={styles.columnTitle}>Help &amp; Connect</h4>
              <ul className={styles.linkList}>
                <li>
                  <button
                    type="button"
                    onClick={() => setIsCallbackOpen(true)}
                    className={styles.footerActionBtn}
                  >
                    Request a Free Callback
                  </button>
                </li>
                <li>
                  <a href="#about">About Our Story</a>
                </li>
                <li>
                  <a href="#faq">Frequently Asked Questions</a>
                </li>
                <li>
                  <a href="mailto:trips@aarivavoyages.com">trips@aarivavoyages.com</a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Legal & Copyright Bar */}
        <div className={styles.bottomBar}>
          <div className={`container ${styles.bottomContainer}`}>
            <p className={styles.copyright}>
              © {new Date().getFullYear()} Aariva Voyages. All rights reserved. Domestic Travel
              Platform.
            </p>
            <div className={styles.trustBadges}>
              <span className={styles.trustItem}>🔒 Inquiries Protected</span>
              <span className={styles.trustItem}>🇮🇳 Made for Indian Travelers</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Callback Modal */}
      <CallbackModal isOpen={isCallbackOpen} onClose={() => setIsCallbackOpen(false)} />
    </>
  );
};

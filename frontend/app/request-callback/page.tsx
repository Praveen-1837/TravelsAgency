import React from 'react';
import type { Metadata } from 'next';
import styles from './page.module.css';
import { CallbackForm } from '@/components/common/CallbackForm';

export const metadata: Metadata = {
  title: 'Request a Free Callback — Aariva Voyages',
  description:
    'Speak directly with our domestic travel specialists. Custom packages for Sikkim, Meghalaya, Andaman, Lakshadweep and Kashmir with zero upfront fees.',
};

export default function RequestCallbackPage() {
  return (
    <div className={styles.pageContainer}>
      <div className="container">
        <div className={styles.wrapper}>
          <div className={styles.infoCol}>
            <span className={styles.eyebrow}>24x7 DEDICATED SUPPORT</span>
            <h1 className={styles.mainHeading}>Let&apos;s Plan Your Dream Indian Journey</h1>
            <p className={styles.leadText}>
              Whether you are looking for a secluded romantic escape in Kashmir or an island
              expedition in Andaman and Lakshadweep, our destination specialists craft hand-tailored
              itineraries tailored to your schedule and budget.
            </p>

            <div className={styles.trustHighlights}>
              <div className={styles.trustItem}>
                <span className={styles.trustIcon}>📞</span>
                <div>
                  <h4>Prompt Follow-up</h4>
                  <p>Our team calls or WhatsApps you within 30 minutes during business hours.</p>
                </div>
              </div>

              <div className={styles.trustItem}>
                <span className={styles.trustIcon}>🛡️</span>
                <div>
                  <h4>100% Free Consultation</h4>
                  <p>
                    Zero booking fees, zero mandatory advance payments before quote finalization.
                  </p>
                </div>
              </div>

              <div className={styles.trustItem}>
                <span className={styles.trustIcon}>💬</span>
                <div>
                  <h4>Direct WhatsApp Assistance</h4>
                  <p>Receive detailed day-by-day PDFs and photo references on WhatsApp.</p>
                </div>
              </div>
            </div>

            <div className={styles.helplineBox}>
              <p>Prefer to speak with an expert right now?</p>
              <a href="tel:+919876543210" className={styles.phoneLink}>
                📞 +91 98765 43210
              </a>
              <span className={styles.hoursNotice}>Lines open 24x7 (Toll Free across India)</span>
            </div>
          </div>

          <div className={styles.formCol}>
            <CallbackForm
              title="Request a Call Back"
              subtitle="Fill out your details below and our team will get in touch with you shortly."
            />
          </div>
        </div>
      </div>
    </div>
  );
}

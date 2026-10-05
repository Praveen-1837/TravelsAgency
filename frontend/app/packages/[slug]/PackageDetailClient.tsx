'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './package-detail.module.css';
import { Package, Review } from '@/lib/types';
import { fetchPackageReviews } from '@/lib/api';
import { CallbackModal } from '@/components/common/CallbackModal';
import { CallbackForm } from '@/components/common/CallbackForm';
import { PackageCard } from '@/components/packages/PackageCard';
import { ReviewScoreCard } from '@/components/reviews/ReviewScoreCard';
import { ReviewList } from '@/components/reviews/ReviewList';
import { ReviewModal } from '@/components/reviews/ReviewModal';
import { gsap, useGSAP, ScrollTrigger, ScrollToPlugin } from '@/lib/gsap';
import { ItineraryRouteVisual } from '@/components/packages/ItineraryRouteVisual';

interface Props {
  pkg: Package;
  similarPackages: Package[];
  initialReviews?: Review[];
}

export default function PackageDetailClient({ pkg, similarPackages, initialReviews = [] }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const stickyCallbackRef = useRef<HTMLDivElement>(null);

  const [activeTab, setActiveTab] = useState<string>('overview');
  const [openDays, setOpenDays] = useState<number[]>([1]); // First day open by default
  const [travelers, setTravelers] = useState<number>(2);
  const [preferredDate, setPreferredDate] = useState<string>('');
  const [isCallbackOpen, setIsCallbackOpen] = useState<boolean>(false);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);

  // Reviews state
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState<boolean>(false);
  const [selectedStarFilter, setSelectedStarFilter] = useState<number | null>(null);

  // GSAP animations & ScrollTrigger scroll-sync
  useGSAP(
    () => {
      const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      // 1. Entrance animation for header
      if (!isReducedMotion) {
        gsap.fromTo(
          '.gsap-detail-anim',
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', stagger: 0.08 }
        );
      }

      // 2. Active tab indicator synchronization via ScrollTrigger
      const sections = ['overview', 'itinerary', 'reviews', 'inquiries'];
      sections.forEach((sectionId) => {
        const el = document.getElementById(sectionId);
        if (!el) return;

        ScrollTrigger.create({
          trigger: el,
          start: 'top 40%',
          end: 'bottom 40%',
          onToggle: (self) => {
            if (self.isActive) {
              setActiveTab(sectionId);
            }
          },
        });
      });

      // 3. Sticky "Request Callback" button slide-in after Hero/Gallery leaves viewport
      if (stickyCallbackRef.current && galleryRef.current) {
        if (isReducedMotion) {
          // Instant jump / visible without slide animation
          gsap.set(stickyCallbackRef.current, { opacity: 1, y: 0 });
        } else {
          gsap.fromTo(
            stickyCallbackRef.current,
            { y: 100, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.4,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: galleryRef.current,
                start: 'bottom top+=80',
                toggleActions: 'play reverse play reverse',
              },
            }
          );
        }
      }
    },
    { scope: containerRef }
  );

  // Smooth anchor scrolling handler using gsap.to(window, { scrollTo })
  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const targetHash = `#${targetId}`;
    const targetEl = document.getElementById(targetId);
    if (!targetEl) return;

    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (isReducedMotion) {
      targetEl.scrollIntoView();
      window.history.pushState(null, '', targetHash);
      setActiveTab(targetId);
    } else {
      const headerHeight = 80;
      const tabsHeight = 56;
      gsap.to(window, {
        scrollTo: { y: targetEl, offsetY: headerHeight + tabsHeight },
        duration: 0.8,
        ease: 'power2.inOut',
        onComplete: () => {
          window.history.pushState(null, '', targetHash);
          setActiveTab(targetId);
        },
      });
    }
  };

  // Toggle single day accordion
  const toggleDay = (dayNum: number) => {
    if (openDays.includes(dayNum)) {
      setOpenDays(openDays.filter((d) => d !== dayNum));
    } else {
      setOpenDays([...openDays, dayNum]);
    }
  };

  // Expand / Collapse all days
  const handleToggleAllDays = () => {
    if (openDays.length === pkg.itinerary.length) {
      setOpenDays([]);
    } else {
      setOpenDays(pkg.itinerary.map((d) => d.day));
    }
  };

  const images =
    pkg.images && pkg.images.length > 0
      ? pkg.images
      : [
          'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
        ];

  const estimatedTotal =
    pkg.price_unit === 'couple'
      ? pkg.price_per_person * Math.ceil(travelers / 2)
      : pkg.price_per_person * travelers;

  return (
    <div ref={containerRef} className={styles.pageWrapper}>
      {/* 1. Breadcrumbs */}
      <div className={styles.breadcrumbBar}>
        <div className={`container ${styles.breadcrumbContainer}`}>
          <Link href="/" className={styles.breadcrumbLink}>
            Home
          </Link>
          <span className={styles.breadcrumbSep}>/</span>
          <Link href="/packages" className={styles.breadcrumbLink}>
            Domestic Packages
          </Link>
          <span className={styles.breadcrumbSep}>/</span>
          <span className={styles.breadcrumbCurrent}>{pkg.title}</span>
        </div>
      </div>

      <div className="container">
        {/* 2. Tour Header Title & Badges */}
        <div className={`${styles.tourHeader} gsap-detail-anim`}>
          <div className={styles.badgeRow}>
            <span className={styles.bestsellerBadge}>BESTSELLER</span>
            <span className={styles.durationBadge}>{pkg.duration}</span>
            <span className={styles.expertBadge}>Expert Assisted</span>
            <span className={styles.bookedPill}>🔥 4.2k+ Travelers Inquired</span>
          </div>

          <h1 className={styles.tourTitle}>{pkg.title}</h1>

          <div className={styles.metaRow}>
            {pkg.rating_avg !== undefined && pkg.review_count !== undefined && (
              <div className={styles.ratingBox}>
                <span className={styles.starIcon}>★</span>
                <span className={styles.ratingVal}>{pkg.rating_avg.toFixed(1)}</span>
                <span className={styles.reviewCount}>({pkg.review_count} verified reviews)</span>
              </div>
            )}
            {pkg.rating_avg !== undefined && <span className={styles.dot}>•</span>}
            <span className={styles.destinationText}>📍 {pkg.destination}</span>
            <span className={styles.dot}>•</span>
            <span className={styles.audienceText}>👥 {pkg.audience.join(' • ').toUpperCase()}</span>
          </div>
        </div>

        {/* 3. Photo Gallery Hero */}
        <div ref={galleryRef} className={styles.gallery}>
          <div className={styles.mainGalleryImage}>
            <Image
              src={images[activeImageIndex] || images[0]}
              alt={pkg.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 780px"
              className={styles.galleryImg}
            />
          </div>

          <div className={styles.sideGalleryTiles}>
            {images.slice(0, 3).map((imgUrl, idx) => (
              <div
                key={idx}
                className={`${styles.sideTile} ${activeImageIndex === idx ? styles.activeTile : ''}`}
                onClick={() => setActiveImageIndex(idx)}
              >
                <Image
                  src={imgUrl}
                  alt={`${pkg.title} preview ${idx + 1}`}
                  fill
                  sizes="380px"
                  className={styles.galleryImg}
                />
              </div>
            ))}
          </div>
        </div>

        {/* 4. Two-Column Layout: Main Content (Left) + Sticky Booking Card (Right) */}
        <div className={styles.twoColumnLayout}>
          {/* LEFT CONTENT COLUMN */}
          <div className={styles.mainContent}>
            {/* Sticky Anchor Tab Navigation */}
            <div className={`${styles.tabNav} ${styles.tabNavSticky}`} role="tablist">
              <a
                href="#overview"
                role="tab"
                aria-selected={activeTab === 'overview'}
                className={`${styles.tabBtn} ${activeTab === 'overview' ? styles.activeTab : ''}`}
                onClick={(e) => handleAnchorClick(e, 'overview')}
              >
                Overview
              </a>
              <a
                href="#itinerary"
                role="tab"
                aria-selected={activeTab === 'itinerary'}
                className={`${styles.tabBtn} ${activeTab === 'itinerary' ? styles.activeTab : ''}`}
                onClick={(e) => handleAnchorClick(e, 'itinerary')}
              >
                Itinerary
              </a>
              <a
                href="#reviews"
                role="tab"
                aria-selected={activeTab === 'reviews'}
                className={`${styles.tabBtn} ${activeTab === 'reviews' ? styles.activeTab : ''}`}
                onClick={(e) => handleAnchorClick(e, 'reviews')}
              >
                Reviews {pkg.review_count !== undefined ? `(${pkg.review_count})` : ''}
              </a>
              <a
                href="#inquiries"
                role="tab"
                aria-selected={activeTab === 'inquiries'}
                className={`${styles.tabBtn} ${activeTab === 'inquiries' ? styles.activeTab : ''}`}
                onClick={(e) => handleAnchorClick(e, 'inquiries')}
              >
                Inquiries &amp; Quote
              </a>
            </div>

            {/* SECTION 1: OVERVIEW */}
            <div id="overview" className={styles.tabContent}>
              <section className={styles.sectionBlock}>
                <h3 className={styles.blockTitle}>Expedition Overview</h3>
                <p className={styles.overviewText}>{pkg.description}</p>
              </section>

              <section className={styles.sectionBlock}>
                <h3 className={styles.blockTitle}>Trip Highlights</h3>
                <div className={styles.highlightsGrid}>
                  <div className={styles.highlightCard}>
                    <span className={styles.highlightIcon}>🏔️</span>
                    <div>
                      <h4>Scenic Landscapes</h4>
                      <p>High altitude valleys, glacial mountain lakes, and virgin beaches.</p>
                    </div>
                  </div>

                  <div className={styles.highlightCard}>
                    <span className={styles.highlightIcon}>🚗</span>
                    <div>
                      <h4>Private Chauffeur</h4>
                      <p>
                        Dedicated sanitized SUV throughout the entire journey with fuel &amp; tolls
                        included.
                      </p>
                    </div>
                  </div>

                  <div className={styles.highlightCard}>
                    <span className={styles.highlightIcon}>🏨</span>
                    <div>
                      <h4>Hand-Picked Stays</h4>
                      <p>
                        Checked for safety, hygiene, premium bedding, and scenic panoramic views.
                      </p>
                    </div>
                  </div>

                  <div className={styles.highlightCard}>
                    <span className={styles.highlightIcon}>🛡️</span>
                    <div>
                      <h4>24x7 Trip Marshal</h4>
                      <p>
                        Direct line of contact for permit clearances, check-ins, and local
                        recommendations.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Social Proof & Traveler Feedback Teaser */}
              {reviews.length > 0 && (
                <section className={styles.sectionBlock}>
                  <div className={styles.reviewsOverviewHeader}>
                    <div>
                      <h3 className={styles.blockTitle}>Traveler Feedback &amp; Stories</h3>
                      {pkg.rating_avg !== undefined && pkg.review_count !== undefined && (
                        <p className={styles.overviewSubtext}>
                          ★ {pkg.rating_avg.toFixed(1)} out of 5.0 • Rated by {pkg.review_count}{' '}
                          verified Indian travelers
                        </p>
                      )}
                    </div>
                    <a
                      href="#reviews"
                      className={styles.viewAllReviewsBtn}
                      onClick={(e) => handleAnchorClick(e, 'reviews')}
                    >
                      View All {reviews.length} Reviews →
                    </a>
                  </div>

                  <div className={styles.overviewReviewsGrid}>
                    {reviews.slice(0, 2).map((r) => (
                      <div key={r.id} className={styles.overviewReviewCard}>
                        <div className={styles.overviewReviewStars}>{'★'.repeat(r.rating)}</div>
                        <p className={styles.overviewReviewQuote}>&ldquo;{r.comment}&rdquo;</p>
                        <div className={styles.overviewReviewAuthor}>
                          <strong>{r.traveler_name}</strong>
                          <span>{r.trip_label || 'Verified Traveler'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* SECTION 2: DAY-BY-DAY ITINERARY ACCORDION & ROUTE VISUAL */}
            <div id="itinerary" className={styles.tabContent}>
              <ItineraryRouteVisual
                itinerary={pkg.itinerary}
                openDays={openDays}
                onToggleDay={toggleDay}
                onToggleAllDays={handleToggleAllDays}
              />

              {/* Inclusions & Exclusions */}
              <section className={styles.sectionBlock} style={{ marginTop: '40px' }}>
                <h3 className={styles.blockTitle}>What&apos;s Included</h3>
                <ul className={styles.inclusionsList}>
                  {pkg.inclusions.map((inc, i) => (
                    <li key={i} className={styles.inclusionItem}>
                      <span className={styles.checkIcon}>✓</span>
                      <span>{inc}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section className={styles.sectionBlock}>
                <h3 className={styles.blockTitle}>What&apos;s Excluded</h3>
                <ul className={styles.exclusionsList}>
                  <li className={styles.exclusionItem}>
                    <span className={styles.crossIcon}>✕</span>
                    <span>Airfare / Train tickets to arrival and departure hubs</span>
                  </li>
                  <li className={styles.exclusionItem}>
                    <span className={styles.crossIcon}>✕</span>
                    <span>
                      Personal laundry, telephone calls, room service, alcoholic beverages
                    </span>
                  </li>
                  <li className={styles.exclusionItem}>
                    <span className={styles.crossIcon}>✕</span>
                    <span>
                      Optional adventure activities (e.g. Scuba diving, Paragliding, Pony rides)
                    </span>
                  </li>
                  <li className={styles.exclusionItem}>
                    <span className={styles.crossIcon}>✕</span>
                    <span>
                      Any expenses arising due to natural calamities or flight cancellations
                    </span>
                  </li>
                </ul>
              </section>
            </div>

            {/* SECTION 3: REVIEWS & TESTIMONIALS */}
            <div id="reviews" className={styles.tabContent}>
              <ReviewScoreCard
                ratingAvg={pkg.rating_avg || 0}
                reviewCount={pkg.review_count || 0}
                onWriteReviewClick={() => setIsReviewModalOpen(true)}
                selectedStarFilter={selectedStarFilter}
                onSelectStarFilter={(star) => setSelectedStarFilter(star)}
              />

              <ReviewList
                reviews={reviews}
                packageTitle={pkg.title}
                selectedStarFilter={selectedStarFilter}
                onClearStarFilter={() => setSelectedStarFilter(null)}
              />
            </div>

            {/* SECTION 4: FULL CALLBACK FORM & INQUIRIES */}
            <div id="inquiries" className={styles.embeddedFormSection}>
              <CallbackForm
                packageId={pkg.id}
                packageTitle={pkg.title}
                defaultDate={preferredDate}
                defaultGroupSize={travelers}
                title={`Request a Customized Callback for ${pkg.destination}`}
                subtitle="Fill in your travel dates and requirements below. Our travel marshal will prepare customized quotes and call/WhatsApp you promptly."
              />
            </div>
          </div>

          {/* RIGHT STICKY BOOKING / CALLBACK CARD */}
          <aside className={styles.stickyColumn}>
            <div className={styles.bookingCard}>
              <div className={styles.bookingCardHeader}>
                {pkg.original_price && (
                  <div className={styles.strikeRow}>
                    <span className={styles.strikePrice}>
                      ₹{pkg.original_price.toLocaleString('en-IN')}
                    </span>
                    {pkg.discount_percent && (
                      <span className={styles.cardDiscountBadge}>{pkg.discount_percent}% OFF</span>
                    )}
                  </div>
                )}

                <div className={styles.cardPriceRow}>
                  <span className={styles.cardInr}>₹</span>
                  <span className={styles.cardPriceBig}>
                    {pkg.price_per_person.toLocaleString('en-IN')}
                  </span>
                  <span className={styles.cardPriceUnit}>/ {pkg.price_unit}</span>
                </div>

                <div className={styles.taxNote}>✓ All permits, tolls &amp; taxes included</div>
                <div className={styles.advisoryNote}>
                  Talk to our travel expert, no payment needed
                </div>
              </div>

              {/* Form Selectors */}
              <div className={styles.bookingFormFields}>
                <div className={styles.formGroup}>
                  <label htmlFor="card-travel-date">PREFERRED TRAVEL DATE</label>
                  <input
                    id="card-travel-date"
                    type="date"
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className={styles.cardDateInput}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>NUMBER OF TRAVELERS</label>
                  <div className={styles.stepperRow}>
                    <button
                      type="button"
                      className={styles.stepBtn}
                      onClick={() => setTravelers(Math.max(1, travelers - 1))}
                    >
                      -
                    </button>
                    <span className={styles.stepVal}>
                      {travelers} Traveler{travelers > 1 ? 's' : ''}
                    </span>
                    <button
                      type="button"
                      className={styles.stepBtn}
                      onClick={() => setTravelers(travelers + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Price Quote Estimate Box */}
                <div className={styles.estimatedQuoteBox}>
                  <div className={styles.quoteRow}>
                    <span>Estimated Total Quote:</span>
                    <strong>₹{estimatedTotal.toLocaleString('en-IN')}</strong>
                  </div>
                  <span className={styles.quoteSubtext}>
                    Exact package pricing finalized on callback
                  </span>
                </div>

                {/* Main Callback Action */}
                <button
                  type="button"
                  className={styles.bookingCtaBtn}
                  onClick={(e) => handleAnchorClick(e as any, 'inquiries')}
                >
                  Request Callback
                </button>

                <div className={styles.urgencyLine}>
                  ⚡ Only 4 departure slots remaining for this season
                </div>

                {/* Trust Checklist */}
                <div className={styles.cardTrustList}>
                  <div className={styles.trustCheckItem}>
                    <span>✓</span> 100% Free Itinerary Customization
                  </div>
                  <div className={styles.trustCheckItem}>
                    <span>✓</span> 24x7 Dedicated Local Trip Marshal
                  </div>
                  <div className={styles.trustCheckItem}>
                    <span>✓</span> Vetted Chauffeurs &amp; Star Stays
                  </div>
                </div>

              </div>
            </div>
          </aside>
        </div>

        {/* 5. Similar Recommended Packages Section */}
        <section className={styles.similarSection}>
          <div className={styles.similarHeader}>
            <span className={styles.eyebrow}>DISCOVER MORE</span>
            <h2 className={styles.similarTitle}>Similar Domestic Journeys</h2>
          </div>

          <div className={styles.similarGrid}>
            {similarPackages.map((simPkg) => (
              <PackageCard key={simPkg.id} pkg={simPkg} />
            ))}
          </div>
        </section>
      </div>

      {/* 6. Sticky Floating "Request Callback" Action Bar (Slides in after Hero leaves viewport) */}
      <div ref={stickyCallbackRef} className={styles.stickyCallbackContainer}>
        <div className={styles.mobileBarPrice}>
          <span className={styles.mobileBarLabel}>From</span>
          <span className={styles.mobileBarAmount}>
            ₹{pkg.price_per_person.toLocaleString('en-IN')}
          </span>
          <span className={styles.mobileBarUnit}>/ {pkg.price_unit}</span>
        </div>
        <button
          type="button"
          className={styles.stickyCallbackBtn}
          onClick={(e) => handleAnchorClick(e as any, 'inquiries')}
          aria-label="Request callback for this tour package"
        >
          Request Callback
        </button>
      </div>

      {/* Callback Inquiry Modal */}
      <CallbackModal
        isOpen={isCallbackOpen}
        onClose={() => setIsCallbackOpen(false)}
        packageId={pkg.id}
        packageTitle={pkg.title}
      />

      {/* Review Submission Modal */}
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        packageSlug={pkg.slug}
        packageTitle={pkg.title}
        onSuccess={() => {
          fetchPackageReviews(pkg.slug).then((res) => {
            if (res?.data && res.data.length > 0) {
              setReviews(res.data);
            }
          });
        }}
      />
    </div>
  );
}

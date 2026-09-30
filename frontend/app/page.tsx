import React from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import { PackageCard } from '@/components/packages/PackageCard';
import { ReviewCarousel } from '@/components/reviews/ReviewCarousel';
import { fetchPackages, fetchAllFeaturedReviews } from '@/lib/api';
import { AnimatedHeroContent } from '@/components/home/AnimatedHeroContent';
import { Reveal } from '@/components/common/Reveal';

export default async function HomePage() {
  const { data: allPackages } = await fetchPackages();
  const featuredReviews = await fetchAllFeaturedReviews();

  // Honeymoon packages (audience includes couple)
  const honeymoonPackages = allPackages.filter((p) => p.audience.includes('couple'));

  // Group & Family packages
  const groupPackages = allPackages.filter(
    (p) => p.audience.includes('group') || p.audience.includes('family')
  );

  // Featured 3 packages for the top showcase grid
  const featuredPackages = allPackages.slice(0, 3);

  return (
    <div className={styles.homeContainer}>
      {/* 1. Hero Section matching Figma Frame (Hero image is LCP and NEVER animated) */}
      <section className={styles.heroSection}>
        <div className={styles.heroOverlay} />
        <AnimatedHeroContent />
      </section>

      {/* 2. Flash Sale Promo Banner (per Figma) */}
      <Reveal className={styles.flashSaleBanner} triggerHook="top 85%">
        <div className={`container ${styles.flashSaleContainer} reveal-item`}>
          <div className={styles.flashSaleText}>
            <span className={styles.flashTag}>FLASH DEAL</span>
            <h4>Up to 22% OFF on Himalayan &amp; Coastal Escapes</h4>
            <p>
              Lock in season rates with our travel specialists. Zero booking fees or payment
              upfront.
            </p>
          </div>
          <Link href="/packages" className={styles.claimDealBtn}>
            Claim Special Quote →
          </Link>
        </div>
      </Reveal>

      {/* 3. Featured Packages Grid (Cards fade up 24px with 0.08s stagger, triggered at top 80%, play once) */}
      <Reveal
        className={styles.featuredSection}
        stagger={0.08}
        triggerHook="top 80%"
        yOffset={24}
        selector=".reveal-item"
      >
        <div className="container">
          <div className={`${styles.sectionHeader} reveal-item`}>
            <div>
              <span className={styles.sectionEyebrow}>HAND-PICKED EXPERIENCES</span>
              <h2 className={styles.sectionTitle}>Trending Domestic Packages</h2>
            </div>
            <Link href="/packages" className={styles.viewAllLink}>
              View All 6 Packages →
            </Link>
          </div>

          <div className={styles.packagesGrid}>
            {featuredPackages.map((pkg) => (
              <div key={pkg.id} className="reveal-item">
                <PackageCard pkg={pkg} />
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* 4. Two Equal Prominent Sections: Honeymoon Specials & Group/Family Trips */}
      <Reveal
        className={styles.collectionSection}
        id="honeymoon"
        stagger={0.08}
        triggerHook="top 80%"
        yOffset={24}
      >
        <div className="container">
          <div className={`${styles.collectionHeaderRow} reveal-item`}>
            <div className={styles.collectionBadgePink}>ROMANTIC RETREATS</div>
            <h2 className={styles.collectionTitle}>Honeymoon Specials</h2>
            <p className={styles.collectionSubtitle}>
              Secluded beach villas, private shikara rides, and candlelit dinners under starlit
              skies.
            </p>
          </div>

          <div className={styles.packagesGrid}>
            {honeymoonPackages.map((pkg) => (
              <div key={pkg.id} className="reveal-item">
                <PackageCard pkg={pkg} />
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      <Reveal
        className={`${styles.collectionSection} ${styles.altBg}`}
        id="family"
        stagger={0.08}
        triggerHook="top 80%"
        yOffset={24}
      >
        <div className="container">
          <div className={`${styles.collectionHeaderRow} reveal-item`}>
            <div className={styles.collectionBadgeBlue}>EXPLORE TOGETHER</div>
            <h2 className={styles.collectionTitle}>Group &amp; Family Trips</h2>
            <p className={styles.collectionSubtitle}>
              Spacious private SUVs, curated multi-generation sightseeing, and certified local
              guides.
            </p>
          </div>

          <div className={styles.packagesGrid}>
            {groupPackages.map((pkg) => (
              <div key={pkg.id} className="reveal-item">
                <PackageCard pkg={pkg} />
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* 5. Why Choose Aariva Voyages (Trust Signals per Figma - Simple Fade-Up) */}
      <Reveal className={styles.trustSection} id="trust" stagger={0.08} triggerHook="top 80%">
        <div className="container">
          <div className={`${styles.trustHeader} reveal-item`}>
            <span className={styles.sectionEyebrow}>THE AARIVA PROMISE</span>
            <h2 className={styles.sectionTitle}>Why Indian Travelers Trust Us</h2>
            <p className={styles.trustSubtitle}>
              We believe a holiday should feel effortless from the very first conversation.
            </p>
          </div>

          <div className={styles.trustGrid}>
            <div className={`${styles.trustCard} reveal-item`}>
              <div className={styles.trustIcon}>🛡️</div>
              <h3 className={styles.trustCardTitle}>100% Verified Local Guides</h3>
              <p className={styles.trustCardText}>
                No unauthorized middlemen. Every vehicle and chauffeur is background-verified with
                native expertise.
              </p>
            </div>

            <div className={`${styles.trustCard} reveal-item`}>
              <div className={styles.trustIcon}>💬</div>
              <h3 className={styles.trustCardTitle}>Inquiry-Based Transparency</h3>
              <p className={styles.trustCardText}>
                No sudden card charges or upfront surprises. We discuss your custom preferences and
                finalize quotes together.
              </p>
            </div>

            <div className={`${styles.trustCard} reveal-item`}>
              <div className={styles.trustIcon}>⭐</div>
              <h3 className={styles.trustCardTitle}>4.8+ Rated Experiences</h3>
              <p className={styles.trustCardText}>
                Consistently rated top-tier for honeymoon escapes, adventurous treks, and relaxed
                family holidays.
              </p>
            </div>

            <div className={`${styles.trustCard} reveal-item`}>
              <div className={styles.trustIcon}>📞</div>
              <h3 className={styles.trustCardTitle}>24x7 On-Trip Marshal</h3>
              <p className={styles.trustCardText}>
                A dedicated trip manager tracks permits, hotel check-ins, weather advisories, and
                vehicle logistics.
              </p>
            </div>
          </div>
        </div>
      </Reveal>

      {/* 6. Testimonials Section (Wrapped in Reveal for simple fade-up animation) */}
      <Reveal stagger={0.08} triggerHook="top 80%">
        <div className="reveal-item">
          <ReviewCarousel
            reviews={featuredReviews}
            title="Real Experiences, Real Memories"
            eyebrow="FROM OUR COMMUNITY"
          />
        </div>
      </Reveal>
    </div>
  );
}

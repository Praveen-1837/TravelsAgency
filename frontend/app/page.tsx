import React from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import { PackageCard } from '@/components/packages/PackageCard';
import { ReviewCarousel } from '@/components/reviews/ReviewCarousel';
import { fetchPackages, fetchAllFeaturedReviews } from '@/lib/api';

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
      {/* 1. Hero Section matching Figma Frame (Explore & Discovery) */}
      <section className={styles.heroSection}>
        <div className={styles.heroOverlay} />
        <div className={`container ${styles.heroContent}`}>
          {/* Trust Pill */}
          <div className={styles.trustPill}>
            <span className={styles.pulseDot} />
            <span>OVER 10,000+ CURATED INDIAN JOURNEYS CRAFTED</span>
          </div>

          <h1 className={styles.heroTitle}>
            Crafting Unforgettable <br />
            <span className={styles.highlightText}>Domestic Journeys</span>
          </h1>

          <p className={styles.heroSubtitle}>
            From the misty valleys of Kanchenjunga to azure Andaman lagoons. Personalized domestic
            tours across India with transparent quotes and 24x7 trip marshals.
          </p>

          {/* Quick CTA Actions */}
          <div className={styles.heroActions}>
            <Link href="/packages" className={styles.primaryCtaBtn}>
              Explore All Packages
            </Link>
            <a href="#honeymoon" className={styles.secondaryCtaBtn}>
              Honeymoon Specials
            </a>
            <a href="#family" className={styles.secondaryCtaBtn}>
              Family &amp; Group Trips
            </a>
          </div>

          {/* Tabbed Search Bar */}
          <div className={styles.searchWidget}>
            <div className={styles.searchFields}>
              <div className={styles.searchField}>
                <span className={styles.searchLabel}>WHERE TO?</span>
                <input
                  type="text"
                  placeholder="e.g. Sikkim, Andaman, Kashmir..."
                  className={styles.searchInput}
                  readOnly
                />
              </div>

              <div className={styles.searchDivider} />

              <div className={styles.searchField}>
                <span className={styles.searchLabel}>TRAVEL STYLE</span>
                <div className={styles.searchSelectSimulated}>Honeymoon / Group / Family</div>
              </div>

              <div className={styles.searchDivider} />

              <div className={styles.searchField}>
                <span className={styles.searchLabel}>BUDGET</span>
                <div className={styles.searchSelectSimulated}>From ₹11,300 / person</div>
              </div>
            </div>

            <Link href="/packages" className={styles.searchSubmitBtn}>
              Search Packages
            </Link>
          </div>

          {/* Popular Destination Chips */}
          <div className={styles.popularChips}>
            <span className={styles.popularLabel}>POPULAR:</span>
            <Link href="/packages/sikkim-darjeeling" className={styles.popularChip}>
              Sikkim-Darjeeling
            </Link>
            <Link href="/packages/andaman-4n-5d" className={styles.popularChip}>
              Andaman Islands
            </Link>
            <Link href="/packages/kashmir-couple-special" className={styles.popularChip}>
              Kashmir Couple
            </Link>
            <Link href="/packages/lakshadweep" className={styles.popularChip}>
              Lakshadweep
            </Link>
            <Link href="/packages/assam-meghalaya" className={styles.popularChip}>
              Assam-Meghalaya
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Flash Sale Promo Banner (per Figma) */}
      <section className={styles.flashSaleBanner}>
        <div className={`container ${styles.flashSaleContainer}`}>
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
      </section>

      {/* 3. Featured Packages Grid (3 Columns Desktop) */}
      <section className={styles.featuredSection}>
        <div className="container">
          <div className={styles.sectionHeader}>
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
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. Two Equal Prominent Sections: Honeymoon Specials & Group/Family Trips */}
      <section className={styles.collectionSection} id="honeymoon">
        <div className="container">
          <div className={styles.collectionHeaderRow}>
            <div className={styles.collectionBadgePink}>ROMANTIC RETREATS</div>
            <h2 className={styles.collectionTitle}>Honeymoon Specials</h2>
            <p className={styles.collectionSubtitle}>
              Secluded beach villas, private shikara rides, and candlelit dinners under starlit
              skies.
            </p>
          </div>

          <div className={styles.packagesGrid}>
            {honeymoonPackages.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
        </div>
      </section>

      <section className={`${styles.collectionSection} ${styles.altBg}`} id="family">
        <div className="container">
          <div className={styles.collectionHeaderRow}>
            <div className={styles.collectionBadgeBlue}>EXPLORE TOGETHER</div>
            <h2 className={styles.collectionTitle}>Group &amp; Family Trips</h2>
            <p className={styles.collectionSubtitle}>
              Spacious private SUVs, curated multi-generation sightseeing, and certified local
              guides.
            </p>
          </div>

          <div className={styles.packagesGrid}>
            {groupPackages.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. Why Choose Aariva Voyages (Trust Signals per Figma) */}
      <section className={styles.trustSection} id="trust">
        <div className="container">
          <div className={styles.trustHeader}>
            <span className={styles.sectionEyebrow}>THE AARIVA PROMISE</span>
            <h2 className={styles.sectionTitle}>Why Indian Travelers Trust Us</h2>
            <p className={styles.trustSubtitle}>
              We believe a holiday should feel effortless from the very first conversation.
            </p>
          </div>

          <div className={styles.trustGrid}>
            <div className={styles.trustCard}>
              <div className={styles.trustIcon}>🛡️</div>
              <h3 className={styles.trustCardTitle}>100% Verified Local Guides</h3>
              <p className={styles.trustCardText}>
                No unauthorized middlemen. Every vehicle and chauffeur is background-verified with
                native expertise.
              </p>
            </div>

            <div className={styles.trustCard}>
              <div className={styles.trustIcon}>💬</div>
              <h3 className={styles.trustCardTitle}>Inquiry-Based Transparency</h3>
              <p className={styles.trustCardText}>
                No sudden card charges or upfront surprises. We discuss your custom preferences and
                finalize quotes together.
              </p>
            </div>

            <div className={styles.trustCard}>
              <div className={styles.trustIcon}>⭐</div>
              <h3 className={styles.trustCardTitle}>4.8+ Rated Experiences</h3>
              <p className={styles.trustCardText}>
                Consistently rated top-tier for honeymoon escapes, adventurous treks, and relaxed
                family holidays.
              </p>
            </div>

            <div className={styles.trustCard}>
              <div className={styles.trustIcon}>📞</div>
              <h3 className={styles.trustCardTitle}>24x7 On-Trip Marshal</h3>
              <p className={styles.trustCardText}>
                A dedicated trip manager tracks permits, hotel check-ins, weather advisories, and
                vehicle logistics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Thrillophilia / Figma Style Verified Traveler Stories Carousel */}
      <ReviewCarousel
        reviews={featuredReviews}
        title="Real Experiences, Real Memories"
        eyebrow="FROM OUR COMMUNITY"
      />
    </div>
  );
}

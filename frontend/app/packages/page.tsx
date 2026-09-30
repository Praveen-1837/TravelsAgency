'use client';

import React, { useState, useMemo, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import styles from './packages.module.css';
import { Package } from '@/lib/types';
import { LOCAL_SEED_PACKAGES } from '@/lib/seed-data';
import { PackageCard } from '@/components/packages/PackageCard';
import { gsap, Flip, useGSAP } from '@/lib/gsap';

function PackagesListingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const resultsContainerRef = useRef<HTMLDivElement>(null);
  const flipStateRef = useRef<any>(null);

  // Read URL params
  const selectedDestination = searchParams.get('destination') || '';
  const selectedAudience = searchParams.get('audience') || '';
  const sortBy = searchParams.get('sort') || 'popular';

  // Client UI states
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('all');
  const [selectedDuration, setSelectedDuration] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'horizontal'>('grid');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Helper to capture Flip state before filter/sort updates
  const captureFlipState = () => {
    if (typeof window === 'undefined') return;
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReducedMotion) return;

    const cards = resultsContainerRef.current?.querySelectorAll('[data-flip-id]');
    if (cards && cards.length > 0) {
      // Kill any in-progress Flip animations to handle rapid repeated clicks cleanly
      gsap.killTweensOf(cards);
      flipStateRef.current = Flip.getState(cards);
    }
  };

  // Helper to update URL search parameters while capturing GSAP Flip state
  const updateFilter = (key: string, value: string, e?: React.SyntheticEvent) => {
    captureFlipState();

    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/packages?${params.toString()}`);

    // Maintain keyboard focus on current element if passed
    if (e && e.currentTarget && 'focus' in e.currentTarget) {
      (e.currentTarget as HTMLElement).focus();
    }
  };

  const handlePriceChange = (val: string, e?: React.SyntheticEvent) => {
    captureFlipState();
    setSelectedPriceRange(val);
    if (e && e.currentTarget && 'focus' in e.currentTarget) {
      (e.currentTarget as HTMLElement).focus();
    }
  };

  const handleDurationChange = (val: string, e?: React.SyntheticEvent) => {
    captureFlipState();
    setSelectedDuration(val);
    if (e && e.currentTarget && 'focus' in e.currentTarget) {
      (e.currentTarget as HTMLElement).focus();
    }
  };

  // Destinations list
  const destinations = [
    { label: 'All Destinations', value: '' },
    { label: 'Sikkim & Darjeeling', value: 'Sikkim' },
    { label: 'Assam & Meghalaya', value: 'Assam' },
    { label: 'Andaman Islands', value: 'Andaman' },
    { label: 'Lakshadweep', value: 'Lakshadweep' },
    { label: 'Kashmir Valley', value: 'Kashmir' },
  ];

  // Filtering and Sorting logic
  const filteredPackages = useMemo(() => {
    let result: Package[] = [...LOCAL_SEED_PACKAGES];

    // 1. Destination filter
    if (selectedDestination) {
      const q = selectedDestination.toLowerCase();
      result = result.filter(
        (p) => p.destination.toLowerCase().includes(q) || p.title.toLowerCase().includes(q)
      );
    }

    // 2. Audience filter
    if (selectedAudience === 'couple') {
      result = result.filter((p) => p.audience.includes('couple'));
    } else if (selectedAudience === 'group_family') {
      result = result.filter(
        (p) => p.audience.includes('group') || p.audience.includes('family')
      );
    } else if (selectedAudience) {
      result = result.filter((p) => p.audience.includes(selectedAudience));
    }

    // 3. Price filter
    if (selectedPriceRange === 'under15') {
      result = result.filter((p) => p.price_per_person < 15000);
    } else if (selectedPriceRange === '15to25') {
      result = result.filter((p) => p.price_per_person >= 15000 && p.price_per_person <= 25000);
    } else if (selectedPriceRange === 'above25') {
      result = result.filter((p) => p.price_per_person > 25000);
    }

    // 4. Duration filter
    if (selectedDuration === 'short') {
      result = result.filter((p) => p.duration_days <= 5);
    } else if (selectedDuration === 'week') {
      result = result.filter((p) => p.duration_days >= 6);
    }

    // 5. Sorting
    if (sortBy === 'price_asc') {
      result.sort((a, b) => a.price_per_person - b.price_per_person);
    } else if (sortBy === 'price_desc') {
      result.sort((a, b) => b.price_per_person - a.price_per_person);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating_avg - a.rating_avg);
    } else if (sortBy === 'duration') {
      result.sort((a, b) => a.duration_days - b.duration_days);
    } else {
      // 'popular'
      result.sort((a, b) => b.review_count - a.review_count);
    }

    return result;
  }, [selectedDestination, selectedAudience, selectedPriceRange, selectedDuration, sortBy]);

  // GSAP Flip animation on filter/sort changes
  useGSAP(
    () => {
      if (!flipStateRef.current || !resultsContainerRef.current) return;

      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        Flip.from(flipStateRef.current, {
          duration: 0.5,
          ease: 'power2.inOut',
          absolute: true,
          onLeave: (elements) =>
            gsap.to(elements, {
              opacity: 0,
              scale: 0.95,
              duration: 0.3,
              ease: 'power2.out',
            }),
          onEnter: (elements) =>
            gsap.fromTo(
              elements,
              { opacity: 0 },
              { opacity: 1, duration: 0.4, ease: 'power2.out' }
            ),
        });
      });

      flipStateRef.current = null;
    },
    { scope: resultsContainerRef, dependencies: [filteredPackages, viewMode] }
  );

  const handleResetFilters = () => {
    captureFlipState();
    setSelectedPriceRange('all');
    setSelectedDuration('all');
    router.push('/packages');
  };

  return (
    <div className={styles.pageContainer}>
      {/* 1. Breadcrumb Row */}
      <div className={styles.breadcrumbBar}>
        <div className={`container ${styles.breadcrumbContainer}`}>
          <Link href="/" className={styles.breadcrumbLink}>
            Home
          </Link>
          <span className={styles.breadcrumbSep}>/</span>
          <span className={styles.breadcrumbCurrent}>Domestic Packages</span>
        </div>
      </div>

      <div className="container">
        {/* 2. Listing Title & Count Header */}
        <div className={styles.headerRow}>
          <div>
            <span className={styles.eyebrow}>CURATED DOMESTIC ESCAPES</span>
            <h1 className={styles.listingTitle}>India Holiday Packages &amp; Treks</h1>
            <p className={styles.listingSubtitle}>
              Hand-picked itineraries across mountains, islands, and rainforests. Request a callback
              for instant customized quotes.
            </p>
          </div>

          {/* Quick Sort & Mobile Filter Toggle */}
          <div className={styles.headerControls}>
            <button
              type="button"
              className={styles.mobileFilterToggle}
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            >
              ⚙️ Filters ({filteredPackages.length})
            </button>

            <div className={styles.sortWrapper}>
              <label htmlFor="sort-select" className={styles.sortLabel}>
                Sort by:
              </label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => updateFilter('sort', e.target.value, e)}
                className={styles.sortSelect}
              >
                <option value="popular">Popularity &amp; Reviews</option>
                <option value="rating">Top Rated (★ High to Low)</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="duration">Duration: Short to Long</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className={styles.viewModeToggle}>
              <button
                type="button"
                className={`${styles.viewBtn} ${viewMode === 'grid' ? styles.viewBtnActive : ''}`}
                onClick={(e) => {
                  captureFlipState();
                  setViewMode('grid');
                  e.currentTarget.focus();
                }}
                title="Grid View"
              >
                ⊞
              </button>
              <button
                type="button"
                className={`${styles.viewBtn} ${viewMode === 'horizontal' ? styles.viewBtnActive : ''}`}
                onClick={(e) => {
                  captureFlipState();
                  setViewMode('horizontal');
                  e.currentTarget.focus();
                }}
                title="List View"
              >
                ☰
              </button>
            </div>
          </div>
        </div>

        {/* 3. Main Layout: Sidebar (286px) + Results (9 cols) */}
        <div className={styles.mainLayout}>
          {/* Filter Sidebar */}
          <aside
            className={`${styles.filterSidebar} ${
              isMobileFilterOpen ? styles.mobileSidebarOpen : ''
            }`}
          >
            <div className={styles.sidebarHeader}>
              <div className={styles.sidebarTitleRow}>
                <h3 className={styles.sidebarTitle}>Filters</h3>
                <button type="button" onClick={handleResetFilters} className={styles.resetBtn}>
                  RESET ALL
                </button>
              </div>
              <button
                type="button"
                className={styles.closeSidebarBtn}
                onClick={() => setIsMobileFilterOpen(false)}
              >
                ✕
              </button>
            </div>

            {/* Destination Filter */}
            <div className={styles.filterSection}>
              <h4 className={styles.filterSectionTitle}>Destination</h4>
              <div className={styles.filterOptions}>
                {destinations.map((d) => (
                  <label key={d.value} className={styles.filterOption}>
                    <input
                      type="radio"
                      name="destination"
                      checked={selectedDestination === d.value}
                      onChange={(e) => updateFilter('destination', d.value, e)}
                    />
                    <span>{d.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Travel Audience / Style Filter */}
            <div className={styles.filterSection}>
              <h4 className={styles.filterSectionTitle}>Travel Style &amp; Audience</h4>
              <div className={styles.filterOptions}>
                <label className={styles.filterOption}>
                  <input
                    type="radio"
                    name="audience"
                    checked={selectedAudience === ''}
                    onChange={(e) => updateFilter('audience', '', e)}
                  />
                  <span>All Styles</span>
                </label>
                <label className={styles.filterOption}>
                  <input
                    type="radio"
                    name="audience"
                    checked={selectedAudience === 'couple'}
                    onChange={(e) => updateFilter('audience', 'couple', e)}
                  />
                  <span>Honeymoon &amp; Couples</span>
                </label>
                <label className={styles.filterOption}>
                  <input
                    type="radio"
                    name="audience"
                    checked={selectedAudience === 'group_family'}
                    onChange={(e) => updateFilter('audience', 'group_family', e)}
                  />
                  <span>Group &amp; Family Trips</span>
                </label>
              </div>
            </div>

            {/* Budget / Price Range Filter */}
            <div className={styles.filterSection}>
              <h4 className={styles.filterSectionTitle}>Budget (per person)</h4>
              <div className={styles.filterOptions}>
                <label className={styles.filterOption}>
                  <input
                    type="radio"
                    name="price"
                    checked={selectedPriceRange === 'all'}
                    onChange={(e) => handlePriceChange('all', e)}
                  />
                  <span>Any Budget</span>
                </label>
                <label className={styles.filterOption}>
                  <input
                    type="radio"
                    name="price"
                    checked={selectedPriceRange === 'under15'}
                    onChange={(e) => handlePriceChange('under15', e)}
                  />
                  <span>Under ₹15,000</span>
                </label>
                <label className={styles.filterOption}>
                  <input
                    type="radio"
                    name="price"
                    checked={selectedPriceRange === '15to25'}
                    onChange={(e) => handlePriceChange('15to25', e)}
                  />
                  <span>₹15,000 – ₹25,000</span>
                </label>
                <label className={styles.filterOption}>
                  <input
                    type="radio"
                    name="price"
                    checked={selectedPriceRange === 'above25'}
                    onChange={(e) => handlePriceChange('above25', e)}
                  />
                  <span>Luxury (₹25,000+)</span>
                </label>
              </div>
            </div>

            {/* Duration Filter */}
            <div className={styles.filterSection}>
              <h4 className={styles.filterSectionTitle}>Duration</h4>
              <div className={styles.filterOptions}>
                <label className={styles.filterOption}>
                  <input
                    type="radio"
                    name="duration"
                    checked={selectedDuration === 'all'}
                    onChange={(e) => handleDurationChange('all', e)}
                  />
                  <span>Any Duration</span>
                </label>
                <label className={styles.filterOption}>
                  <input
                    type="radio"
                    name="duration"
                    checked={selectedDuration === 'short'}
                    onChange={(e) => handleDurationChange('short', e)}
                  />
                  <span>4 – 5 Days (Weekend &amp; Short)</span>
                </label>
                <label className={styles.filterOption}>
                  <input
                    type="radio"
                    name="duration"
                    checked={selectedDuration === 'week'}
                    onChange={(e) => handleDurationChange('week', e)}
                  />
                  <span>6 – 7 Days (Full Escapes)</span>
                </label>
              </div>
            </div>

            {/* Help Callout */}
            <div className={styles.sidebarHelp}>
              <h5>Looking for something custom?</h5>
              <p>Our travel marshals build tailor-made domestic itineraries at zero cost.</p>
              <a href="tel:+919876543210" className={styles.sidebarCallLink}>
                📞 Call +91 98765 43210
              </a>
            </div>
          </aside>

          {/* Results Column */}
          <main className={styles.resultsArea} ref={resultsContainerRef}>
            {/* Live region for accessibility result count announcements */}
            <div className={styles.resultsCountBar} aria-live="polite" aria-atomic="true">
              Showing <strong>{filteredPackages.length}</strong> verified domestic packages
              {(selectedDestination ||
                selectedAudience ||
                selectedPriceRange !== 'all' ||
                selectedDuration !== 'all') && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className={styles.activeFilterReset}
                >
                  Clear Active Filters ✕
                </button>
              )}
            </div>

            {filteredPackages.length === 0 ? (
              <div className={styles.noResultsBox}>
                <div className={styles.noResultsIcon}>🔍</div>
                <h3>No packages found matching your criteria</h3>
                <p>
                  Try broadening your filters or reach out to our team directly for customized
                  packages.
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className={styles.resetPrimaryBtn}
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className={viewMode === 'grid' ? styles.resultsGrid : styles.resultsList}>
                {filteredPackages.map((pkg) => (
                  <PackageCard
                    key={pkg.id}
                    pkg={pkg}
                    variant={viewMode === 'horizontal' ? 'horizontal' : 'grid'}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default function PackagesPage() {
  return (
    <Suspense
      fallback={<div style={{ padding: '60px', textAlign: 'center' }}>Loading packages...</div>}
    >
      <PackagesListingContent />
    </Suspense>
  );
}

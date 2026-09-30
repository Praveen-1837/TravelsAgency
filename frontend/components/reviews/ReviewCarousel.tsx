'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './ReviewCarousel.module.css';
import { Review } from '@/lib/types';
import { PhotoLightboxModal } from './PhotoLightboxModal';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';

interface Props {
  reviews: Review[];
  title?: string;
  eyebrow?: string;
}

export const ReviewCarousel: React.FC<Props> = ({
  reviews,
  title = 'Verified Traveler Stories & Unforgettable Journeys',
  eyebrow = 'FROM OUR COMMUNITY',
}) => {
  const carouselSectionRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);
  const [lightboxTraveler, setLightboxTraveler] = useState<string>('');
  const [lightboxTripLabel, setLightboxTripLabel] = useState<string | undefined>(undefined);
  const [lightboxPkgTitle, setLightboxPkgTitle] = useState<string | undefined>(undefined);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const cards = carouselSectionRef.current?.querySelectorAll(`.${styles.storyCard}`);
        if (!cards || cards.length === 0) return;

        gsap.fromTo(
          cards,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: 'power2.out',
            stagger: 0.08,
            scrollTrigger: {
              trigger: carouselSectionRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      });
    },
    { scope: carouselSectionRef }
  );

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const handleOpenPhoto = (
    url: string,
    traveler: string,
    tripLabel?: string,
    pkgTitle?: string
  ) => {
    setLightboxImg(url);
    setLightboxTraveler(traveler);
    setLightboxTripLabel(tripLabel);
    setLightboxPkgTitle(pkgTitle);
  };

  return (
    <section ref={carouselSectionRef} className={styles.carouselSection} id="community-reviews">
      <div className="container">
        {/* Header Row */}
        <div className={styles.headerRow}>
          <div>
            <span className={styles.eyebrow}>{eyebrow}</span>
            <h2 className={styles.title}>{title}</h2>
            <div className={styles.communityStatsRow}>
              <span className={styles.ratingPill}>★ 4.8 / 5.0</span>
              <span>Based on 920+ verified domestic reviews across India</span>
            </div>
          </div>

          <div className={styles.navControls}>
            <button
              type="button"
              className={styles.navBtn}
              onClick={() => scroll('left')}
              aria-label="Previous stories"
            >
              ←
            </button>
            <button
              type="button"
              className={styles.navBtn}
              onClick={() => scroll('right')}
              aria-label="Next stories"
            >
              →
            </button>
          </div>
        </div>

        {/* Scrolling Cards Viewport */}
        <div className={styles.carouselViewport} ref={scrollContainerRef}>
          <div className={styles.cardsTrack}>
            {reviews.map((story) => {
              const photoUrl =
                story.photos && story.photos.length > 0
                  ? story.photos[0]
                  : 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80';

              return (
                <div
                  key={story.id}
                  className={styles.storyCard}
                  onClick={() =>
                    handleOpenPhoto(
                      photoUrl,
                      story.traveler_name,
                      story.trip_label,
                      story.package_title
                    )
                  }
                >
                  <div className={styles.photoFrame}>
                    <Image
                      src={photoUrl}
                      alt={`Photo by ${story.traveler_name}`}
                      fill
                      sizes="380px"
                      className={styles.cardImg}
                    />
                    {story.trip_label && (
                      <span className={styles.tripLabelBadge}>{story.trip_label}</span>
                    )}
                    <span className={styles.ratingTag}>
                      <span>★</span> {story.rating}.0
                    </span>
                  </div>

                  <div className={styles.cardBody}>
                    <div className={styles.starsRow}>{'★'.repeat(story.rating)}</div>
                    <p className={styles.quoteText}>&ldquo;{story.comment}&rdquo;</p>

                    <div className={styles.authorRow}>
                      <div className={styles.authorMeta}>
                        <div className={styles.avatar}>{getInitials(story.traveler_name)}</div>
                        <div>
                          <h4 className={styles.authorName}>{story.traveler_name}</h4>
                          <span className={styles.verifiedText}>✓ Verified Traveler</span>
                        </div>
                      </div>

                      {story.package_slug && (
                        <Link
                          href={`/packages/${story.package_slug}`}
                          className={styles.tourLink}
                          onClick={(e) => e.stopPropagation()}
                        >
                          View Tour →
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxImg && (
        <PhotoLightboxModal
          isOpen={!!lightboxImg}
          onClose={() => setLightboxImg(null)}
          imageUrl={lightboxImg}
          travelerName={lightboxTraveler}
          tripLabel={lightboxTripLabel}
          packageTitle={lightboxPkgTitle}
        />
      )}
    </section>
  );
};

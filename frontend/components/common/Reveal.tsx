'use client';

import React, { useRef, useEffect } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  triggerHook?: string;
  yOffset?: number;
  duration?: number;
  selector?: string;
  id?: string;
}

export const Reveal: React.FC<RevealProps> = ({
  children,
  className = '',
  stagger = 0.08,
  triggerHook = 'top 80%',
  yOffset = 24,
  duration = 0.5,
  selector = '.reveal-item',
  id,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // 1. Desktop (min-width: 768px): Fade up with Y-translation and stagger
      mm.add(
        '(min-width: 768px) and (prefers-reduced-motion: no-preference)',
        () => {
          const targets = containerRef.current?.querySelectorAll(selector);
          const elements = targets && targets.length > 0 ? targets : [containerRef.current];

          gsap.fromTo(
            elements,
            { opacity: 0, y: yOffset },
            {
              opacity: 1,
              y: 0,
              duration,
              ease: 'power2.out',
              stagger,
              scrollTrigger: {
                trigger: containerRef.current,
                start: triggerHook,
                once: true,
              },
            }
          );
        }
      );

      // 2. Mobile (max-width: 767px): Simple fade only for below-the-fold sections
      mm.add(
        '(max-width: 767px) and (prefers-reduced-motion: no-preference)',
        () => {
          const targets = containerRef.current?.querySelectorAll(selector);
          const elements = targets && targets.length > 0 ? targets : [containerRef.current];

          gsap.fromTo(
            elements,
            { opacity: 0 },
            {
              opacity: 1,
              duration: 0.4,
              ease: 'power2.out',
              stagger: 0.05,
              scrollTrigger: {
                trigger: containerRef.current,
                start: triggerHook,
                once: true,
              },
            }
          );
        }
      );
    },
    { scope: containerRef }
  );

  // Call ScrollTrigger.refresh() after image load
  useEffect(() => {
    const handleImageLoad = () => {
      ScrollTrigger.refresh();
    };

    const container = containerRef.current;
    if (!container) return;

    const images = container.querySelectorAll('img');
    images.forEach((img) => {
      if (img.complete) return;
      img.addEventListener('load', handleImageLoad);
    });

    return () => {
      images.forEach((img) => {
        img.removeEventListener('load', handleImageLoad);
      });
    };
  }, []);

  return (
    <div ref={containerRef} className={className} id={id}>
      {children}
    </div>
  );
};

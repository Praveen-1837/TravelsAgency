'use client';

import React, { useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';

interface Props {
  children: React.ReactNode;
  className?: string;
  id?: string;
  delay?: number;
  stagger?: number;
}

export const AnimatedSection: React.FC<Props> = ({
  children,
  className = '',
  id,
  delay = 0,
  stagger = 0.1,
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const targets = sectionRef.current?.querySelectorAll('.gsap-reveal');
        if (!targets || targets.length === 0) return;

        // Set initial hidden state in JS (not CSS) to prevent layout shifts
        gsap.fromTo(
          targets,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            delay,
            ease: 'power2.out',
            stagger,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      });
    },
    { scope: sectionRef }
  );

  return (
    <div ref={sectionRef} className={className} id={id}>
      {children}
    </div>
  );
};

'use client';

import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { Flip } from 'gsap/Flip';
import { SplitText } from 'gsap/SplitText';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { CustomEase } from 'gsap/CustomEase';
import { CustomWiggle } from 'gsap/CustomWiggle';
import { useState, useEffect } from 'react';

// Only register plugins in the browser context to prevent SSR issues
if (typeof window !== 'undefined') {
  gsap.registerPlugin(
    useGSAP,
    ScrollTrigger,
    ScrollToPlugin,
    Flip,
    SplitText,
    DrawSVGPlugin,
    CustomEase,
    CustomWiggle
  );
}

/**
 * Custom React hook to check if user prefers reduced motion safely in SSR & client
 */
export function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const onChange = (event) => {
      setPrefersReducedMotion(event.matches);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', onChange);
      return () => mediaQuery.removeEventListener('change', onChange);
    } else {
      mediaQuery.addListener(onChange);
      return () => mediaQuery.removeListener(onChange);
    }
  }, []);

  return prefersReducedMotion;
}

export { gsap, useGSAP, ScrollTrigger, ScrollToPlugin, Flip, SplitText, DrawSVGPlugin };

'use client';

import { createContext, useContext, useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

type LenisApi = {
  stop: () => void;
  start: () => void;
  scrollTo: (target: string | HTMLElement) => void;
};

const LenisContext = createContext<LenisApi | null>(null);

/** Nav uses this to freeze the page behind the mobile overlay. */
export function useLenis(): LenisApi | null {
  return useContext(LenisContext);
}

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Owns Lenis + ScrollTrigger for the whole page, and intercepts in-page anchor
 * clicks so native jumps don't fight the smooth scroller.
 *
 * Under reduced motion Lenis is skipped entirely, but the context still exposes
 * a working scrollTo/stop/start so callers don't need to branch.
 */
export function SmoothScroll({ children }: { children?: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const [api, setApi] = useState<LenisApi | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const reduced = prefersReducedMotion();
    let rafId = 0;

    if (!reduced) {
      const lenis = new Lenis({
        duration: 1.15,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 1.4,
      });
      lenisRef.current = lenis;

      const raf = (time: number) => {
        lenis.raf(time);
        rafId = requestAnimationFrame(raf);
      };
      rafId = requestAnimationFrame(raf);
      lenis.on('scroll', ScrollTrigger.update);
    }

    const scrollTo = (target: string | HTMLElement) => {
      const el =
        typeof target === 'string' ? document.querySelector(target) : target;
      if (!el) return;
      if (lenisRef.current) {
        lenisRef.current.scrollTo(el as HTMLElement, {
          offset: -90,
          duration: 1.4,
        });
      } else {
        const top =
          (el as HTMLElement).getBoundingClientRect().top + window.scrollY - 90;
        window.scrollTo({ top, behavior: 'auto' });
      }
    };

    setApi({
      stop: () => lenisRef.current?.stop(),
      start: () => lenisRef.current?.start(),
      scrollTo,
    });

    // Route every in-page anchor through the scroller.
    const onClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement | null)?.closest?.(
        'a[href^="#"]',
      ) as HTMLAnchorElement | null;
      if (!anchor) return;
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;
      const el = document.querySelector(href);
      if (!el) return;
      e.preventDefault();
      scrollTo(el as HTMLElement);
    };
    document.addEventListener('click', onClick);

    return () => {
      document.removeEventListener('click', onClick);
      if (rafId) cancelAnimationFrame(rafId);
      lenisRef.current?.destroy();
      lenisRef.current = null;
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <LenisContext.Provider value={api}>{children ?? null}</LenisContext.Provider>
  );
}

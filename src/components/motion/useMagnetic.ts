'use client';

import { useEffect } from 'react';
import { gsap } from 'gsap';
import { prefersReducedMotion } from './SmoothScroll';

/**
 * Magnetic hover on every [data-magnetic] CTA.
 * Factor .14 on x, .22 on y; resets to 0 on pointerleave.
 * Skipped entirely under reduced motion and on coarse pointers.
 */
export function useMagnetic() {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const cleanups: Array<() => void> = [];

    document
      .querySelectorAll<HTMLElement>('[data-magnetic]')
      .forEach((el) => {
        const toX = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' });
        const toY = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' });

        const onMove = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          toX((e.clientX - (r.left + r.width / 2)) * 0.14);
          toY((e.clientY - (r.top + r.height / 2)) * 0.22);
        };
        const onLeave = () => {
          toX(0);
          toY(0);
        };

        el.addEventListener('pointermove', onMove);
        el.addEventListener('pointerleave', onLeave);
        cleanups.push(() => {
          el.removeEventListener('pointermove', onMove);
          el.removeEventListener('pointerleave', onLeave);
          gsap.set(el, { x: 0, y: 0 });
        });
      });

    return () => cleanups.forEach((fn) => fn());
  }, []);
}
